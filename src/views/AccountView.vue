<template>
  <div class='grid'>
    <Navbar pageName='Profile' />

    <div class='account'>
      <div class='account-info'>
        <div class='avatar'></div>
        <p class='name'>Michael</p>
        <AccentButton class='edit-profile'>Edit</AccentButton>
        <AccentButton class='friends'>
          <Icon icon='users'/>
          <span>37</span>
        </AccentButton>
        <OutlineButton class='logout' @click='supabase.auth.signOut()'>Logout</OutlineButton>
      </div>

      <div class='gallery'>
        <Preview type='image' :media='story.media_url' v-for='story in stories' @mouseleave='menuState = -1'>
          <div class='options'>
            <AccentButton class='icon menu-toggle' @click='menuState = story.id'>
              <Icon icon='more-horizontal'/>
            </AccentButton>

            <div class='menu' v-show='menuState == story.id'>
              <AccentButton class='delete' @click='deleteStory(story.id)'>
                <Icon icon='trash-2'/>
                <span>Delete</span>
              </AccentButton>
            </div>
          </div>
        </Preview>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'

const stories = ref([])
const menuState = ref(-1)

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

    stories.value = data;
  } catch (error) {
    console.error(error)
  }
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

onMounted(getOwnStories)
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

  .avatar {
    display: block;
    width: $element-height;
    height: $element-height;
    background: $color-bg-2;
    border-radius: 100%;
  }

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

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: max-content;
  padding: 15px;
  margin: 0 auto;

  .preview {
    position: relative;
    cursor: pointer;
    
    &:hover {
      .options {
        visibility: visible;
      }
    }

    .options {
      display: grid;
      gap: 10px;
      position: absolute;
      top: 10px;
      right: 10px;
      visibility: hidden;

      .menu-toggle {
        border-radius: 100px;
        margin: 0 0 0 auto;
      }
    }

    .menu {
      border-radius: 10px;
      background: $color-bg-2;
      padding: 5px;
      margin: 0 0 0 auto;

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
</style>
