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

@include use-theme {
button {
  font-family: inherit;
  border: 0;
  border-radius: 10px;
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;
  background: theme('color-button-solid-bg');
  color: theme('color-button-solid-text');

  &:hover {
    background: theme('color-button-solid-bg-hove')r;
  }
}
}
</style>