<template>
  <div class='grid'>
    <Navbar pageName='Share' />

    <div class='share'>
      <Preview :type='store.editor.type' :media='store.editor.previewURL'>
        <AccentButton class='back icon' @click="$router.push('/create')">
          <Icon icon='arrow-left'/>
        </AccentButton>
      </Preview>

      <div class='contacts'>
        <IconInput icon='search' placeholder='Search' v-model='keyword'/>

        <div class='recipients'>
          <div class='tag' v-for='profile in recipients'>
            <div class='avatar'></div>
            <p class='name'>{{ profile.full_name }}</p>
            <AccentButton class='remove icon' @click='toggle(profile)'>
              <Icon icon='x' />
            </AccentButton>
          </div>
        </div>

        <div class='followers'>
          <p class='category'>Followers</p>

          <template v-for='({ follower }, index) in followers'>
            <div class='item' :id='follower.username' v-show='filter(follower)' @click='toggle(follower)'>
              <div class='avatar' :style='`background-image: url(${ follower.avatar_url })`'></div>
              <p class='name'>{{ follower.full_name }}</p>
              <RadioInput />
            </div>
          </template>
        </div>
      </div>

      <SolidButton class='share' @click='createStory'>Share</SolidButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { uuid } from 'vue-uuid'
import { supabase } from '../supabase'
import { joinPaths } from '../utils'
import { uploadImage } from '../upload'
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'

const router = useRouter()
const type = store.editor.type
const file = store.editor.file
const path = joinPaths([store.profile.id, uuid.v4()]) // without extension

const followers = ref([])
const recipients = ref({})
const keyword = ref('')

async function getFollowers () {
  const { data, error } = await supabase
    .from('followers')
    .select(`
      profile,
      follower ( id, username, full_name, avatar_url )
    `)
    .eq('profile', store.profile.id)

  if (error) {
    console.error(error)
  }

  console.log(data)
  followers.value = data
}

async function createStory () {
  let uploadResponse;
  let storyId;

  // Upload media
  if (type == 'image' && file)  {
    uploadResponse = await uploadImage('images', path + '.jpg', file)
  }

  // Create story
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert({
        media_url: uploadResponse.path,
        profile: store.profile.id
      })
      .select(`id`)
      .single()

    if (error) throw error

    storyId = data.id
  } catch (error) {
    console.log(error)
  }

  // Set own access
  try {
    const { error } = await supabase
      .from('sharing')
      .insert({
        profile: store.profile.id,
        story: storyId
      })

    if (error) throw error
  } catch (error) {
    console.log(error)
  }

  // Set recipient access
  for (let username in recipients.value) {
    try {
      const { error } = await supabase
        .from('sharing')
        .insert({
          profile: recipients.value[username].id,
          story: storyId
        })

      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  }

  // Clear store.editor
  store.editor = {
    file: null,
    type: '',
    previewURL: ''
  }

  router.push('/')
}

function toggle (profile) {
  // Toggle radio input 
  const username = profile.username
  const radio = document.querySelector(`#${username} .radio-input`)
  radio.click()

  // Add/remove profile from recipients
  if (radio.dataset.checked == 'true') {
    delete recipients.value[username]
  } else {
    recipients.value[username] = profile
  }
}

function filter (profile) {
  const value = keyword.value
  if (!value ||
      profile.full_name.indexOf(value) > -1 ||
      profile.username.indexOf(value) > -1
    ) {
    return true
  }
  return false
}

onMounted(() => {
  if (!file) router.push('/create')
  getFollowers()
})
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.share {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 15px;

  .preview {
    position: relative;
    width: 150px;
    height: 210px;
    margin: 0 auto;

    .back {
      position: absolute;
      top: 50%;
      transform: translate(calc(-100% - 15px), -50%);
      border-radius: 100px;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 400px;
    margin: 0 auto;

    .avatar {
      display: block;
      width: 40px;
      height: 40px;
      border: 1px solid $color-border-1;
      border-radius: 100%;
      background: $color-bg-2;
      margin: auto 0;
    }

    .recipients {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      max-height: 150px;
      overflow: auto;

      .tag {
        display: flex;
        width: max-content;
        gap: 10px;
        border-radius: 10px;
        background: $color-bg-2;
        padding: 7px;

        .avatar {
          width: 25px;
          height: 25px;
        }

        .name {
          color: $color-text-2;
          margin: auto 0;
        }

        .remove {
          width: max-content;
          height: max-content;
          padding: 0;
          border-radius: 100%;
          background: transparent;
          margin: auto 0;
        }
      }
    }

    .followers {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .category {
        color: $color-text-2;
        margin: 0;
      }

      .item {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 10px;
        border-radius: 10px;
        cursor: pointer;

        .name {
          margin: auto 0;
        }

        .radio-input {
          margin: auto 0;
        }
      }

      .item::before {
        content: '';
        display: block;
        position: absolute;
        width: calc(100% + 20px);
        height: calc(100% + 20px);
        border-radius: 15px;
        top: -10px;
        left: -10px;
        transition: background 0.2s;
        z-index: -1;
      }

      .item:hover::before {
        background: $color-bg-2;
      }
    }
  }

  .share {
    border-radius: 100px;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
</style>
