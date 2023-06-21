<template>
  <div class='prompt'>
    <slot></slot>
  </div>
</template>

<style scoped lang='scss'>
@import '../assets/themes';

.prompt {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba($color-bg-1, $shade-5);
  backdrop-filter: blur(30px);
  z-index: 10;
}
</style>