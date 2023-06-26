<template>
  <button class='button-outline' ref='element'>
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const element = ref(null)

defineExpose({ element })
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
button {
  font-family: inherit;
  border: 1px solid;
  border-radius: $border-radius-2;
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;
  border-color: theme('color-button-border');
  background: theme('color-button-outline-bg');
  color: theme('color-button-outline-text');

  &:hover {
    border-color: theme('color-button-outline-border-hover');
    color: theme('color-button-outline-text-hover');
  }
}
}
</style>