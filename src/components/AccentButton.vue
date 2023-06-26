<template>
  <button class='button-accent' ref='element'>
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

@include use-theme {
button {
  font-family: inherit;
  border: 0;
  border-radius: 10px;
  background: theme('color-button-accent-bg');
  color: theme('color-button-accent-text');
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;

  &:hover {
    background: theme('color-button-accent-bg-hover');
    color: theme('color-button-accent-text-hover');
  }
}
}
</style>