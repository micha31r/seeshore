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
import { toRefs, defineProps } from 'vue'

defineProps(['type', 'url', 'blur'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.preview {
  display: flex;
  width: 400px;
  height: 560px;
  background: $color-bg-2;
  border-radius: 10px;

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
    border-radius: 10px;
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
    border-radius: 10px;
  }
}
</style>