<template>
  <div class='preview'>
    <div v-if="type == 'image'" class='wrapper'>
      <div v-if='blur' class='blur' :style='`background-image: url(${url})`'></div>
      <div class='image' :style='`background-image: url(${url})`'></div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted, watch } from 'vue'
import { download } from '../supabase'
import { isValidURL } from '../utils'

const props = defineProps(['type', 'media', 'blur'])
const { type, media } = toRefs(props)
const url = ref('')

async function updateURL () {
  if (type.value == 'image') {
    url.value = isValidURL(media.value)
      ? media.value
      : await download('images', media.value)
  }
}

onMounted(() => {
  updateURL()
  watch(media, updateURL)
})
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.preview {
  display: flex;
  width: 400px;
  height: 560px;
  background: $color-bg-2;
  border-radius: 15px;

  .wrapper {
    position: relative;
    display: flex;
    flex: 1;
  }

  .blur {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 15px;
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
    border-radius: 15px;
  }
}
</style>