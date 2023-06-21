<template>
  <div class='grid'>
    <Navbar pageName='Profile' />

    <div class='account'>
      <div class='account-info'>
        <Avatar :profile='store.profile'/>
        <p class='name'>{{ store.profile.full_name }}</p>

        <AccentButton class='edit-profile' @click='toggleAccountEditor'>Edit</AccentButton>

        <AccentButton class='friends'>
          <Icon icon='users'/>
          <span>37</span>
        </AccentButton>

        <OutlineButton class='logout' @click='supabase.auth.signOut()'>Logout</OutlineButton>
      </div>

      <div class='stories'>
        <div class='preview-wrapper' v-for='story in stories'>
          <div class='meta'>
            <AccentButton class='likes'>
              <Icon icon='heart' />
              <span v-if='likeData[story.id]'>{{ likeData[story.id].length }}</span>
            </AccentButton>  

            <div class='options'>
              <AccentButton class='icon menu-toggle' @click='menuState = menuState == story.id ? -1 : story.id'>
                <Icon icon='more-horizontal'/>
              </AccentButton>

              <div class='menu' v-show='menuState == story.id'>
                <AccentButton class='delete' @click='deleteStory(story.id)'>
                  <Icon icon='trash-2'/>
                  <span>Delete</span>
                </AccentButton>
              </div>
            </div>
          </div>

          <Preview type='image' :media='story.media_url' blur='true' />
        </div>
      </div>

      <AccountEditor ref='accountEditor' @deleteAccount='toggleDeleteAccount'/>
      <DeleteAccount ref='deleteAccount' />
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

const stories = ref([])
const likeData = ref({})
const menuState = ref(-1)
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
        profile (id, username, avatar_url, full_name),
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
        .select(`story, profile`)
        .eq('story', item.id)

      if (error) throw error

      results[item.id] = data
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

    getOwnStories()
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
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  gap: 15px;
  width: max-content;
  padding: 0 15px 15px;
  margin: 0 auto;

  .name {
    margin: auto 0;
  }

  .edit-profile {
    height: $element-height;
    padding: 0 15px;
    border-radius: 100px;
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

    .options {
      display: grid;
      gap: 10px;
      position: relative;

      .menu-toggle {
        border-radius: 100px;
        margin: 0 0 0 auto;
      }

      .menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        border-radius: 10px;
        border: 1px solid $color-border-1;
        background: $color-bg-2;
        padding: 5px;
        margin: 0 0 0 auto;
        z-index: 1;

        button {
          display: flex;
          gap: 5px;
          border-radius: 5px;
          padding: 5px;

          span, .feather {
            margin: auto 0;
          }
        }
      }
    }
  }
}
</style>
