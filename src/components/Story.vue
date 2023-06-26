<template>
  <div class='story' v-if='story' ref='element'>
    <!-- Other information such as author -->
    <div class='meta'>
      <slot :story='story'></slot>
    </div>

    <!-- Media -->
    <Preview type='image' v-if='image' :media='image' blur='true' @click='cycle' :key='storyIndex'>
      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='storyIndex == index'></span>
      </div>
    </Preview>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineExpose, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { download } from '../supabase'
import Preview from './Preview.vue'

const router = useRouter()
const props = defineProps(['data'])
const stories = toRefs(props).data
const storyIndex = ref(0)
const images = ref([])
const element = ref(null)

// Current data
const story = ref()
const image = ref()

defineExpose({ getFrameData })

onMounted(async () => {
  await preload()
  // resize()
  // addEventListener('resize', resize)
})

// router.beforeEach((to, from, next) => {
//   removeEventListener('resize', resize)
//   next()
// })

// function resize () {
//   const nav = document.querySelector('nav')
//   const height = window.innerHeight - nav.clientHeight - 15
//   element.value.style.height = height + 'px'
// }

// Get story data at current index
function getFrameData () {
  story.value = stories.value[storyIndex.value]
  image.value = images.value[storyIndex.value]
}

// Preload images and like data
async function preload () {
  for (let i = 0; i < stories.value.length; i++) {
    const item = stories.value[i]
    images.value.push(await download('images', item.media_url))
  }

  getFrameData()
}

function cycle () {
  (storyIndex.value) < stories.value.length - 1
    ? storyIndex.value++ 
    : storyIndex.value = 0

  getFrameData()
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.story {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
  width: 100%;
  height: max-content;
  background: theme('color-bg-2');
  border-radius: $border-radius-1;
  padding: 10px;
  overflow: hidden;

  .meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .preview {
    position: relative;
    margin: 0 auto;

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