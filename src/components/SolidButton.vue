<template>
  <button class='button-outline' :='$attrs'>
    <slot></slot>
  </button>
</template>

<style scoped lang='scss'>
@import '../assets/themes';

button {
  font-family: inherit;
  border: 0;
  border-radius: 10px;
  padding: 10px;
  transition: color 0.2s, background 0.2s, border 0.2s;
  cursor: pointer;
  background: $color-button-solid-bg;
  color: $color-button-solid-text;

  &:hover {
    background: $color-button-solid-bg-hover;
  }
}
</style>