<template>
  <div class='grid'>
    <Navbar pageName='Profile' />

    <div class='account'>
      <div class='account-info'>
        <div class='row'>
          <Avatar :profile='store.profile'/>
          <p class='name'>{{ store.profile.full_name }}</p>
          <AccentButton class='edit' @click='toggleAccountEditor'>Edit Profile</AccentButton>

          <AccentButton class='friends' @click='$router.push({ name: "people" })'>
            <Icon icon='users'/>
            <span>14.5k / 204</span>
          </AccentButton>
        </div>
      </div>

      <div class='stories'>
        <div class='preview-wrapper' v-for='story in stories'>
          <div class='meta'>
            <AccentButton class='likes' @click='likeState = story.id'>
              <Icon icon='heart' />
              <span v-if='likeData[story.id]'>{{ likeData[story.id].length }}</span>
            </AccentButton>  

            <Menu align='right'>
              <template #buttonContent>
                <Icon icon='more-horizontal'/>
              </template>

              <template #listContent>
                <AccentButton class='icon-text' @click='deleteStory(story.id)'>
                  <Icon icon='trash-2'/>
                  <span>Delete</span>
                </AccentButton>
              </template>
            </Menu>
          </div>

          <Preview type='image' :media='story.media_url' blur='true' />
        </div>
      </div>

      <AccountEditor ref='accountEditor' @deleteAccount='toggleDeleteAccount'/>
      <DeleteAccount ref='deleteAccount' />

      <Prompt v-if='likeState >= 0'>
        <div class='like-profiles'>
          <h3 class='heading'>Liked By</h3>
          <ProfileList :data='likeData[likeState]' fallback='This story does not have any likes.'/>
          <AccentButton @click='likeState = -1'>Close</AccentButton>
        </div>
      </Prompt>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'
import Avatar from '../components/Avatar.vue'
import AccountEditor from '../components/AccountEditor.vue'
import DeleteAccount from '../components/DeleteAccount.vue'
import ProfileList from '../components/ProfileList.vue'

const stories = ref([])
const showAccountMenu = ref(false)
const likeData = ref({})
const likeState = ref(-1)
const accountEditor = ref(null)
const deleteAccount = ref(null)

function toggleAccountEditor () {
  accountEditor.value.toggle()
}

function toggleDeleteAccount () {
  deleteAccount.value.toggle()
}

async function getOwnStories() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id,
        profile (id, avatar_url, full_name),
        media_url
      `)
      .eq('profile', store.profile.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data;
  } catch (error) {
    console.error(error)
  }
}

async function getLikeData () {
  const results = {}

  for (let i = 0; i < stories.value.length; i++) {
    const item = stories.value[i]

    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          profile (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('story', item.id)

      if (error) throw error

      // Set values to an array of profiles
      results[item.id] = data.map(item => item.profile)
    } catch (error) {
      console.error(error)
    }
  }

  return results
}

async function deleteStory (id) {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id)

    if (error) throw error

    stories.value = await getOwnStories()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  stories.value = await getOwnStories()
  likeData.value = await getLikeData()
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

.account-info {
  display: flex;
  flex-direction: column;
  // grid-template-columns: auto auto auto 1fr auto;
  // gap: 15px;
  // width: max-content;
  // padding: 0 15px 15px;
  // margin: 0 auto;

  .row {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 0 15px 15px;
    margin: 0 auto;
  }

  .name {
    margin: auto 0;
  }

  .edit {
    height: $element-height;
    padding: 0 15px;
  }

  .friends {
    display: flex;
    gap: 5px;
    width: max-content;
    height: $element-height; 
    background: transparent;
    padding: 0;

    & > * {
      margin: auto 0;
    }
  }

  .logout {
    height: $element-height;
    border-radius: 100px;
    padding: 0 15px;
  }
}

.stories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: max-content;
  padding: 15px;
  margin: 0 auto;

  .preview-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 15px;
    background: $color-bg-2;
    border-radius: 15px;
    padding: 15px;
    overflow: hidden;
  }

  .meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;

    .likes {
      display: flex;
      gap: 7px;
      width: max-content;
      height: $element-height;
      padding-top: 0;
      padding-bottom: 0;

      & > * {
        margin: auto 0;
      }

      .feather {
        stroke: $color-text-2;
        fill: $color-text-2;
      }
    }
  }
}

.like-profiles {
  display: grid;
  gap: 15px;
  grid-template-rows: auto 1fr auto;
  width: 400px;
  height: max-content;
  border: 1px solid $color-border-1;
  border-radius: 15px;
  background: $color-bg-1;
  padding: 15px;
  margin: auto;

  .heading {
    margin: 0;
  }

  .profile-list {
    height: 200px;
    overflow: auto;
  }
}
</style>
