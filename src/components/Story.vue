<template>
  <div class='story' :data-loaded='isLoaded' ref='element' @pointerdown='imageSizeHandle.start' @pointerup='imageSizeHandle.end' @mousemove='imageSizeHandle.move' @touchmove='imageSizeHandle.move'>
    <!-- Other information such as author -->
    <div class='meta'>
      <slot :story='stories[0]'></slot>
    </div>

    <!-- Content -->
    <div class='glide-wrapper'>
      <div class='glide' :id='"glide-" + glideId'>
        <div class='glide__track' data-glide-el='track'>
          <div class='glide__slides'>
            <Preview
              v-for='(image, index) in images'
              class='glide__slide'
              type='image'
              :media='image'
              :blur='index == glideIndex'
              :size='imageSize' />
          </div>
        </div>

        <!-- Left right button -->
        <div class='glide__arrows' data-glide-el='controls' hidden>
          <button class='glide__arrow glide__arrow--left icon' data-glide-dir='<' ref='leftButton'></button>
          <button class='glide__arrow glide__arrow--right icon' data-glide-dir='>' ref='rightButton'></button>
        </div>

        <!-- Bullet progress -->
        <div v-if='stories.length > 1' class='glide__bullets' data-glide-el='controls[nav]'>
          <div v-for='(_, index) in images' class='glide__bullet' :data-glide-dir='`=${index}`'></div>
        </div>
      </div>

       <!-- Left right button -->
      <div v-if='!isMobile()' class='arrow-controls' data-glide-el='controls'>
        <SolidButton :hidden='glideIndex == 0' class='icon' @click='leftButton.click()'>
          <Icon icon='chevron-left' />
        </SolidButton>

        <SolidButton :hidden='glideIndex == stories.length - 1' class='icon' @click='rightButton.click()'>
          <Icon icon='chevron-right' />
        </SolidButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue'
import { uuid } from 'vue-uuid'
import Glide from '@glidejs/glide'
import { download } from '../supabase'
import { OnHold } from '../controls'
import { isMobile } from '../utils'
import Preview from './Preview.vue'

const props = defineProps(['data'])
const stories = toRefs(props).data
const images = ref([])
const imageSize = ref('cover')
const glideId = ref(uuid.v4())
const glideIndex = ref(0)
const leftButton = ref(null)
const rightButton = ref(null)
const isLoaded = ref(false)

const glide = new Glide('#glide-' + glideId.value, {
    type: 'slider',
    perView: 1,
    gap: 11,
    animationDuration: 200,
    rewind: false
})

glide.on('move', () => {
  glideIndex.value = glide.index
})

onMounted(async () => {
  await preload()
  glide.mount()
  isLoaded.value = true
})

// Toggle image size
const imageSizeHandle = new OnHold(() => {
  imageSize.value = imageSize.value == 'cover'
    ? 'contain'
    : 'cover'
})

// Preload images and like data
async function preload () {
  for (let i = 0; i < stories.value.length; i++) {
    const item = stories.value[i]
    images.value.push(await download('images', item.media_url))
  }
}
</script>

<style scoped lang='scss'>
// Required by Glide JS
@import 'node_modules/@glidejs/glide/src/assets/sass/glide.core';
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.story {
  // Glide js width calculation does NOT work with grid,
  // so use flexbox instead
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: max-content;
  background: theme('color-bg-2');
  border-radius: $border-radius-1;
  padding: 10px;
  overflow: hidden;
  visibility: hidden;

  &[data-loaded='true'] {
    visibility: visible;
  }

  .meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .glide-wrapper {
    position: relative;
  }

  .glide {
    max-width: 350px;
    position: relative;
    margin: 0 auto;

    .glide__track {
      border-radius: $border-radius-2;
      overflow: visible;

      .glide__slides {
        overflow: visible;
      }
    }

    .glide__arrows {
      visibility: hidden;
    }

    .glide__bullets {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%, 0);
      display: flex;
      gap: 5px;
      margin: auto;
      pointer-events: none;

      .glide__bullet {
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 100%;
        background: #FFF;
        opacity: 0.5;
      }

      .glide__bullet--active {
        opacity: 1;
      }
    }
  }

  .arrow-controls {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;

    button {
      width: calc($nav-content-height * 3 / 4);
      height: calc($nav-content-height * 3 / 4);
      border-radius: $border-radius-round;
      background: #FFF;
      color: #000;
      opacity: 0.5;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }

      &[hidden] {
        visibility: hidden;
      }
    }
  }
}
}
</style>