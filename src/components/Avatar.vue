<!-- For the Sully family 💙 -->

<template>
  <div class='avatar' :style='`width: ${width}px; height: ${height}px;`' ref='avatar'>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import { minidenticon } from 'minidenticons'
import store from '../store'
import { download } from '../supabase'
import { isValidURL } from '../utils'

const props = defineProps(['width', 'height', 'media', 'profile'])
const { media, profile } = toRefs(props)
const avatar = ref(null)

defineExpose({ element: avatar })

onMounted(() => {
  updateURL()
  watch(media, updateURL)
  watch(profile, updateURL)
})

async function updateURL () {
  let source = media.value

  if (profile) {
    source = profile.value.avatar_url

    // Generate image based on profile id
    if (!source) {
      source = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(profile.value.id))
    }
  }

  source = isValidURL(source)
    ? source
    : await download('avatars', source)

  avatar.value.style.backgroundImage = `url("${source}")`
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.avatar {
  display: block;
  width: $nav-content-height;
  height: $nav-content-height;
  border-radius: 100%;
  background-color: theme('color-bg-2');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
}
</style>