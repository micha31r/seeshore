<template>
  <div class='preview' ref='element'>
    <div v-if="type == 'image'" class='wrapper'>
      <div v-if='blur' class='blur' :style='`background-image: url(${url})`'></div>
      <div class='image' :style='`background-image: url(${url})`'></div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { download } from '../supabase'
import { isValidURL, isMobile } from '../utils'

const router = useRouter()
const props = defineProps(['type', 'media', 'blur'])
const { type, media } = toRefs(props)
const url = ref('')
const element = ref(null)
const aspectRatio = 16 / 9

defineExpose({ element, resize })

onMounted(() => {
  updateURL()
  watch(media, updateURL)
  resize()
  addEventListener('resize', resize)
})

router.beforeEach((to, from, next) => {
  removeEventListener('resize', resize)
  next()
})

function resize () {
  const heightLimit = window.innerHeight * 0.8
  let width = element.value.clientWidth
  let height = width * aspectRatio

  // If height is too big,
  // resize width so the height fits within the limit
  if (!isMobile() && height > heightLimit) {
    height = heightLimit
    width = height / aspectRatio

    // Set max width
    element.value.style.maxWidth = width + 'px'
  }

  element.value.style.height = height + 'px'
}

async function updateURL () {
  if (type.value == 'image') {
    url.value = isValidURL(media.value)
      ? media.value
      : await download('images', media.value)
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.preview {
  display: flex;
  width: 100%;
  height: 100%;
  background: theme('color-bg-2');
  border-radius: $border-radius-2;

  .wrapper {
    position: relative;
    display: flex;
    flex: 1;
  }

  .blur {
    display: none;
    flex: 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: $border-radius-2;
    filter: blur(30px);
    opacity: 0.7;
  }

  .image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: $border-radius-2;
  }
}
}

[data-theme='dark'] {
  .preview {
    .blur {
      display: block;
    }
  }
}
</style>