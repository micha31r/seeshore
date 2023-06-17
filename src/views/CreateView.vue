<template>
  <Protect>
    <div class='grid'>
      <Navbar pageName='Create' />

      <div class='editor'>
        <p class='help-text'>Tap to add media. Hold to add text.</p>
        <div class='image'></div>
        <SolidButton class='send'>Send</SolidButton>
      </div>
    </div>
  </Protect>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: max-content;
  margin: auto;

  .help-text {
    color: $color-text-2;
    margin: 0;
    text-align: center;
  }

  .image {
    display: block;
    width: 400px;
    height: 560px;
    border-radius: 15px;
    background: $color-bg-2;
    margin: 0 auto;
  }

  .send {
    border-radius: 100px;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
</style>
