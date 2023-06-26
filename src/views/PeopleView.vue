<template>
  <div class='grid'>
    <Navbar pageName='People' />

    <div class='people'>
      <!-- Follow requests -->
      <div class='requests' v-if='requests.length'>
        <h3 class='heading'>Requests</h3>

        <ProfileList :data='requests'>
          <template #default='{profile}'>
            <div class='actions'>
              <SolidButton @click='approveFollowRequest(profile)'>Approve</SolidButton>

              <Menu align='right'>
                <template #buttonContent>
                  <Icon icon='more-vertical' />
                </template>

                <template #listContent>
                  <AccentButton class='icon-text' @click='rejectFollowRequest(profile)'>
                    <Icon icon='trash-2' />
                    <span>Reject</span>
                  </AccentButton>
                </template>
              </Menu>
            </div>
          </template>
        </ProfileList>
      </div>

      <!-- Pending following -->
      <div class='pending' v-if='pending.length'>
        <h3 class='heading'>Pending</h3>
        <ProfileList :data='pending'></ProfileList>
      </div>

      <!-- Followers -->
      <div class='followers'>
        <h3 class='heading'>Follower</h3>

        <ProfileList :data='followers' fallback="You don't have any followers.">
          <template #default='{profile}'>
            <div class='actions'>
              <Menu align='right'>
                <template #buttonContent>
                  <Icon icon='more-vertical' />
                </template>

                <template #listContent>
                  <AccentButton class='icon-text' @click='removeFollower(profile)'>
                    <Icon icon='trash-2' />
                    <span>Remove</span>
                  </AccentButton>
                </template>
              </Menu>
            </div>
          </template>
        </ProfileList>
      </div>

      <!-- Following -->
      <div class='following'>
        <h3 class='heading'>Following</h3>
        
        <ProfileList :data='following' fallback="You don't have any followers.">
          <template #default='{profile}'>
            <div class='actions'>
              <AccentButton v-if='profile.isUnfollowed' @click='follow(profile)'>Follow</AccentButton>
              <AccentButton v-else @click='unfollow(profile)'>Unfollow</AccentButton>
            </div>
          </template>
        </ProfileList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import store, { storeCache, forceExpire } from '../store'
import { getFollowers, getFollowing } from '../api'
import Navbar from '../components/Navbar.vue'
import ProfileList from '../components/ProfileList.vue'

const followers = ref([])
const following = ref([])
const requests = ref([])
const pending = ref([])

onMounted(async () => {
  followers.value = await getFollowers()
  following.value = await getFollowing()
  requests.value = await getFollowRequests()
  pending.value = await getPendingFollowing()
})

async function approveFollowRequest (profile) {
  await createFollower(profile)
  await deleteFollowRequest(profile)

  forceExpire('followers')
  forceExpire('followRequests')

  followers.value = await getFollowers()
  requests.value = await getFollowRequests()
}

async function rejectFollowRequest (profile) {
  await deleteFollowRequest(profile)

  forceExpire('followRequests')

  requests.value = await getFollowRequests()
}

async function createFollower (profile) {
  try {
    const { error } = await supabase
      .from('followers')
      .insert({
        follower: profile.id,
        profile: store.profile.id
      })

    if (error) throw error
  } catch (error) {
    console.error(error)
  }
}

async function deleteFollowRequest (profile) {
  try {
    const { error } = await supabase
      .from('follow_requests')
      .delete()
      .eq('following', store.profile.id)
      .eq('profile', profile.id)

    if (error) throw error
  } catch (error) {
    console.error(error)
  }
}

async function getPendingFollowing () {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          following (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('profile', store.profile.id)

        if (error) throw error

        return data.map(item => item.following)
    } catch (error) {
      console.error(error)
    }
  }, 'pendingFollowing')
}

async function getFollowRequests () {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('follow_requests')
        .select(`
          profile (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('following', store.profile.id)

        if (error) throw error

        return data.map(item => item.profile)
    } catch (error) {
      console.error(error)
    }
  }, 'followRequests')
}

async function removeFollower(target) {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower', target.id)
      .eq('profile', store.profile.id)

    if (error) throw error

    forceExpire('follower')
  
    followers.value = await getFollowers()
  } catch (error) {
    console.error(error)
  }
}

async function unfollow(target) {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower', store.profile.id)
      .eq('profile', target.id)

    if (error) throw error

    // Mark profile as unfollowed
    following.value.some(item => {
      if (item.id == target.id) {
        item.isUnfollowed = true
        return true
      }
    })
  } catch (error) {
    console.error(error)
  }
}

async function follow(target) {
  try {
    const { error } = await supabase
      .from('followers')
      .insert({
        follower: store.profile.id,
        profile: target.id
      })

    if (error) throw error

    // Mark profile as followed
    following.value.some(item => {
      if (item.id == target.id) {
        item.isUnfollowed = false
        return true
      }
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.people {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  padding: 15px;
  margin: 0 auto;
  gap: 30px;

  @media (max-width: 500px) {
    padding: 15px 10px 10px;
  }

  .heading {
    margin: 0 0 15px;
  }

  .profile-list {
    .actions {
      display: flex;
      gap: 15px;
      margin-left: auto;

      & > * {
        margin: auto 0;
      }

      & > button {
        height: 100%;
        padding-top: 0;
        padding-bottom: 0;
      }

      .menu::v-deep .toggle {
        background: transparent;
      }
    }
  }
}

.pending::v-deep {
  .profile-list {
    flex-direction: row;
    gap: 5px;

    .profile {
      width: max-content;
      border-radius: $border-radius-2;
      background: theme('color-bg-2');
      padding: 7px;
      gap: 7px;

      .avatar {
        width: 20px !important;
        height: 20px !important;
      }
    }
  }
}
}
</style>
