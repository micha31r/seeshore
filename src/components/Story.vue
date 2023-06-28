<template>
  <div class='story' v-if='story' ref='element'>
    <!-- Other information such as author -->
    <div class='meta'>
      <slot :story='story'></slot>
    </div>

    <!-- Media -->
    <Preview type='image' v-if='image' :media='image' blur='true' :key='storyIndex'>
      <div class='controls'>
        <div class='left'  @click='cycle(-1)'>
          <AccentButton class='icon'>
            <Icon icon='chevron-left' />
          </AccentButton>
        </div>

         <div class='right' @click='cycle(1)'>
          <AccentButton class='icon'>
            <Icon icon='chevron-right' />
          </AccentButton>
        </div>
      </div>

      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='storyIndex == index'></span>
      </div>
    </Preview>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue'
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
})

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

function cycle (direction) {
  (storyIndex.value) < stories.value.length - 1
    ? storyIndex.value += direction 
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

    .controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 100%;
      height: 100%;
      padding: 10px;

      .left {
        display: flex;
        justify-content: left;
      }

      .right {
        display: flex;
        justify-content: right;
      }

      button {
        width: calc($nav-content-height * 3 / 4);
        height: calc($nav-content-height * 3 / 4);
        border-radius: $border-radius-round;
        background: #FFF;
        color: #000;
        opacity: 0.7;
        margin: auto 0;
      }
    }

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
        background: #FFF;
        opacity: 0.5;

        &[data-on='true'] {
          opacity: 1;
        }
      }
    }
  }
}
}
</style>