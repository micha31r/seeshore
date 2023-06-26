<template>
  <div class='story' v-if='story' ref='element'>
    <div class='meta'>
      <!-- Profile -->
      <div class='profile'>
        <Avatar :profile='story.profile' />
        <p class='name'>{{ story.profile.full_name }}</p>
      </div>

      <!-- Like button -->
      <AccentButton class='icon like' @click='toggleLike' :data-has-liked='likeIndex >= 0'>
        <Icon icon='heart'/>
      </AccentButton>
    </div>

    <!-- Media -->
    <Preview type='image' v-if='image' :media='image' blur='true' @click='cycle' :key='storyIndex' ref='preview'>
      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='storyIndex == index'></span>
      </div>
    </Preview>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, download } from '../supabase'
import store from '../store'
import Preview from './Preview.vue'
import Avatar from './Avatar.vue'

const router = useRouter()
const props = defineProps(['data'])
const stories = toRefs(props).data
const storyIndex = ref(0)
const images = ref([])
const element = ref(null)
const preview = ref(null)

// Current data
const likes = ref([]) // array of story ids
const likeIndex = ref(-1)
const story = ref()
const image = ref()

onMounted(async () => {
  await preload()
  resize()
  addEventListener('resize', resize)
})

router.beforeEach((to, from, next) => {
  removeEventListener('resize', resize)
  next()
})

function resize () {
  const nav = document.querySelector('nav')
  const height = window.innerHeight - nav.clientHeight - 15
  element.value.style.height = height + 'px'
  preview.value.resize()
}

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
</script>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
.story {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 15px;
  background: theme('color-bg-2');
  border-radius: 15px;
  padding: 15px;
  overflow: hidden;

  .meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;

    .profile {
      display: flex;
      gap: 10px;

      .name {
        margin: auto 0;
      }
    }

    button.like {
      margin: auto 0 auto auto;

      &[data-has-liked='true'] .feather {
        fill: theme('color-bg-1-invert');
      }
      
      .feather {
        color: theme('color-text-1');
      }
    }
  }

  .preview {
    position: relative;
    cursor: pointer;

    .progress {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%, 0);
      display: flex;
      gap: 5px;
      margin: auto;

      .dot {
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 100%;
        background: rgba(theme('color-text-1'), $shade-3);

        &[data-on='true'] {
          background: theme('color-text-1');
        }
      }
    }
  }
}
}
</style>