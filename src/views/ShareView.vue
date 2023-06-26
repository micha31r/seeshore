<template>
  <div class='grid'>
    <Navbar pageName='Share' />

    <div class='share'>
      <!-- Story preview -->
      <Preview :type='store.editor.type' :media='store.editor.previewURL'>
        <AccentButton class='back icon' @click="$router.push('/create')">
          <Icon icon='arrow-left'/>
        </AccentButton>
      </Preview>

      <div class='contacts'>
        <!-- Search box -->
        <IconInput icon='search' placeholder='Search' v-model='keyword'/>

        <!-- Selected users -->
        <div class='recipients'>
          <div class='tag' v-for='follower in recipients'>
            <Avatar width='20' height='20' :profile='follower'/>
            <p class='name'>{{ follower.full_name }}</p>

            <AccentButton class='remove icon' @click='toggle(follower)'>
              <Icon icon='x' />
            </AccentButton>
          </div>
        </div>

        <!-- All followers -->
        <div class='followers'>
          <p class='category'>Followers</p>

          <template v-for='follower in followers'>
            <div class='item' v-show='filter(follower)' @click='toggle(follower)'>
              <Avatar  width='35' height='35' :profile='follower'/>
              <p class='name'>{{ follower.full_name }}</p>

              <RadioInput
                :checked='recipients.findIndex(item => item.id == follower.id) > -1'
                :key='recipients.length'
              />
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
import { getFollowers } from '../api'
import store, { forceExpire } from '../store'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'
import Avatar from '../components/Avatar.vue'

const router = useRouter()
const type = store.editor.type
const file = store.editor.file
const path = joinPaths([store.profile.id, uuid.v4()]) // without extension

const followers = ref([])
const recipients = ref([])
const keyword = ref('')

onMounted(async () => {
  if (!file) router.push('/create')
    
  followers.value = await getFollowers()
})

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
  recipients.value.forEach(async item => {
    try {
      const { error } = await supabase
        .from('sharing')
        .insert({
          profile: item.id,
          story: storyId
        })

      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  })

  // Clear store.editor
  store.editor = {
    file: null,
    type: '',
    previewURL: ''
  }

  forceExpire('stories')

  router.push('/')
}

function toggle (profile) {
  // console.log(profile)
  // Add/remove profile from recipients
  const index = recipients.value.findIndex(item => item.id == profile.id)
  if (index > -1) {
    recipients.value.splice(index, 1)
  } else {
    recipients.value.push(profile)
  }
}

function filter (profile) {
  const key = keyword.value.toLowerCase()
  const name = profile.full_name.toLowerCase()
  return !key || name.indexOf(key) > -1
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
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
        gap: 7px;
        border-radius: 10px;
        background: theme('color-bg-2');
        padding: 7px;

        .name {
          font-size: 0.8em;
          margin: auto 0;
        }

        .remove {
          width: max-content;
          height: max-content;
          padding: 0;
          border-radius: 100%;
          background: transparent;
          margin: auto 0;

          .feather {
            width: 1em;
            height: 1em;
          }
        }
      }
    }

    .followers {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .category {
        color: theme('color-text-2');
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
        background: theme('color-bg-2');
      }
    }
  }

  .share {
    border-radius: 100px;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
}
</style>
