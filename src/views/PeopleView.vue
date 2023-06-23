<template>
  <div class='grid'>
    <Navbar pageName='People' />

    <div class='people'>
      <div class='followers'>
        <h3 class='heading'>Follower</h3>
        <ProfileList :data='followers' fallback="You don't have any followers.">
          <template #default='{profile}'>
            <OutlineButton class='remove' @click='removeFollower(profile)'>Remove</OutlineButton>
          </template>
        </ProfileList>
      </div>

      <div class='following'>
        <h3 class='heading'>Following</h3>
        <ProfileList :data='following' fallback="You don't have any followers.">
          <template #default='{profile}'>
            <OutlineButton v-if='profile.isUnfollowed' @click='follow(profile)'>Follow</OutlineButton>
            <OutlineButton v-else @click='unfollow(profile)'>Unfollow</OutlineButton>
          </template>
        </ProfileList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import store from '../store'
import Navbar from '../components/Navbar.vue'
import ProfileList from '../components/ProfileList.vue'

const followers = ref([])
const following = ref([])

async function getFollowers () {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        follower (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('profile', store.profile.id)

    if (error) throw error

    return data.map(item => item.follower)
  } catch (error) {
    console.error(error)
  }
}

async function getFollowing () {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        profile (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('follower', store.profile.id)

    if (error) throw error

    return data.map(item => item.profile)
  } catch (error) {
    console.error(error)
  }
}

async function removeFollower(target) {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower', target.id)
      .eq('profile', store.profile.id)

    if (error) throw error

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

onMounted(async () => {
  followers.value = await getFollowers()
  following.value = await getFollowing()
})
</script>

<style scoped lang='scss'>
@import '../assets/themes';

$element-height: calc(1.1em + 15px);

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.people {
  width: 100%;
  max-width: 700px;
  padding: 15px;
  margin: 0 auto;

  .heading {
    // margin: 0;
  }

  .profile-list button {
    width: 90px;
    height: $element-height;
    border-radius: 100px;
    padding: 0;
    margin-left: auto;
  }
}
</style>
