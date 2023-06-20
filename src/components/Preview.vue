<template>
  <div class='preview'>
    <div class='image' v-if="type == 'image'" :style='`background-image: url(${url})`'></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { toRefs, defineProps } from 'vue'

const props = defineProps(['type', 'url'])
const { type, url } = toRefs(props)
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.preview {
  display: flex;
  width: 400px;
  height: 560px;
  background: $color-bg-2;
  border-radius: 15px;

  .image {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 15px;
  }
}
</style>