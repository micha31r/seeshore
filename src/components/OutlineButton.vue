<template>
  <button class='button-outline'>
    <slot></slot>
  </button>
</template>

<style scoped lang='scss'>
@import '../assets/themes';

button {
  font-family: inherit;
  border: 1px solid;
  border-radius: 10px;
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;
  border-color: $color-button-border;
  background: $color-button-outline-bg;
  color: $color-button-outline-text;

  &:hover {
    border-color: $color-button-outline-border-hover;
    color: $color-button-outline-text-hover;
  }
}
</style>