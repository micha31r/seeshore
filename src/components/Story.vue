<template>
  <div class='story' v-if='story'>
    <div class='meta'>
      <!-- Profile -->
      <div class='profile'>
        <Avatar :profile='story.profile' />
        <p class='name'>{{ story.profile.full_name }}</p>
      </div>

      <!-- Pagination -->
      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='storyIndex == index'></span>
      </div>

      <!-- Like button -->
      <AccentButton class='icon like' @click='toggleLike' :data-has-liked='likeIndex >= 0'>
        <Icon icon='heart'/>
      </AccentButton>
    </div>

    <!-- Media -->
    <Preview type='image' v-if='image' :media='image' blur='true' @click='cycle' :key='storyIndex'/>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import { supabase, download } from '../supabase'
import store from '../store'
import Preview from './Preview.vue'
import Avatar from './Avatar.vue'

const props = defineProps(['data'])
const stories = toRefs(props).data
const storyIndex = ref(0)
const images = ref([])

// Current data
const likes = ref([]) // array of story ids
const likeIndex = ref(-1)
const story = ref()
const image = ref()

// Get story data at current index
function getCurrentData () {
  story.value = stories.value[storyIndex.value]
  image.value = images.value[storyIndex.value]
  likeIndex.value = likes.value.indexOf(story.value.id)
}

// Preload images and like data
async function preload () {
  for (let i = 0; i < stories.value.length; i++) {
    const item = stories.value[i]
    images.value.push(await download('images', item.media_url))
  }

  likes.value = await getLikes()

  getCurrentData()
}

function cycle () {
  (storyIndex.value) < stories.value.length - 1
    ? storyIndex.value++ 
    : storyIndex.value = 0

  getCurrentData()
}

async function getLikes () {
  const storyIds = stories.value.map(item => item.id)

  try {
    const { data, error } = await supabase
      .from('likes')
      .select(`story`)
      .eq('profile', store.profile.id)
      .in('story', storyIds)

    if (error) throw error

    return data.map(item => item.story)
  } catch (error) {
    console.error(error)
  }
}

async function toggleLike () {
  try {
    if (likeIndex.value >= 0) {
      // Remove like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('story', story.value.id)
        .eq('profile', store.profile.id)

      if (error) throw error

      likes.value.splice(likeIndex.value, 1)

    } else {
      // Add like
      const { data, error } = await supabase
        .from('likes')
        .insert({
          story: story.value.id,
          profile: store.profile.id
        })
        .select(`id, story, profile`)
        .single()

      if (error) throw error
      
      likes.value.push(story.value.id)
    }

    // Refresh story
    getCurrentData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(preload)
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.story {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 15px;
  width: 100%;
  height: 100%;
  background: $color-bg-2;
  border-radius: 15px;
  padding: 15px;
  overflow: hidden;

  .meta {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;

    .profile {
      display: flex;
      gap: 10px;

      .name {
        margin: auto 0;
      }
    }

    .progress {
      display: flex;
      gap: 5px;
      margin: auto;

      .dot {
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 100%;
        background: rgba($color-theme-2, $shade-3);

        &[data-on='true'] {
          background: $color-theme-2;
        }
      }
    }

    button.like {
      margin: auto 0 auto auto;

      &[data-has-liked='true'] .feather {
        fill: $color-bg-1-invert;
      }
      
      .feather {
        color: $color-text-1;
      }
    }
  }

  .preview {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>