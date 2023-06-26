<template>
  <div class='prompt'>
    <slot></slot>
  </div>
</template>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
.prompt::v-deep {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 1600px;
  height: 100vh;
  background: rgba(theme('color-bg-1'), $shade-5);
  backdrop-filter: blur(30px);
  z-index: 10;

  & > * {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
    background: theme('color-bg-1');
    border: 1px solid theme('color-border-1');
    border-radius: 15px;
    padding: 15px;
    margin: auto;
  }

  .heading {
    margin: 0;
  }

  .info {
    color: theme('color-text-2');
    margin: 0 0 30px;
  }
}
}
</style>