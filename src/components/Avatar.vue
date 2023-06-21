<!-- For the Sully family 💙 -->

<template>
  <div class='avatar' :style='`width: ${width}px; height: ${height}px; background-image: url(${url})`'></div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted, watch } from 'vue'
import store from '../store'
import { download } from '../supabase'
import { isValidURL } from '../utils'

const props = defineProps(['width', 'height', 'media'])
const { media } = toRefs(props)
const url = ref('')

async function updateURL () {
  url.value = isValidURL(media.value)
    ? media.value
    : await download('images', media.value)
}

onMounted(() => {
  updateURL()
  watch(media, updateURL)
})
</script>

<style scoped lang='scss'>
@import '../assets/themes';

$width: calc(1.1em + 15px);
$height: calc(1.1em + 15px);

.avatar {
  display: block;
  width: $width;
  width: $height;
  border-radius: 100%;
  background-color: $color-bg-2;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>