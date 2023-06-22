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

button {
  font-family: inherit;
  border: 0;
  border-radius: 10px;
  background: $color-button-accent-bg;
  color: $color-button-accent-text;
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;

  &:hover {
    background: $color-button-accent-bg-hover;
    color: $color-button-accent-text-hover;
  }
}
</style>