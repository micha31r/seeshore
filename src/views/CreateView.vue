<template>
  <div class='grid'>
    <Navbar pageName='Create' />

    <div class='editor'>
      <!-- Hidden field -->
      <input type='file' accept='image/png, image/jpeg, image/webp' ref='input' @change='handleFile' hidden>

      <p class='help-text'>Tap to add media.</p>
      <Preview @click='input.click()' :type='store.editor.type' :media='store.editor.previewURL' />
      <SolidButton class='next' @click="$router.push('/share')" :disabled='!store.editor.file'>Next</SolidButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import store from '../store'
import { toBase64 } from '../utils'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'

const input = ref(null)

async function handleFile(event) {
  const file = event.target.files[0]
  const type = file.type.split('/')[0]

  // Generate preview URL
  let url;
  if (type == 'image') {
    url = await toBase64(file);
  }

  store.editor.previewURL = url;
  store.editor.file = file
  store.editor.type = type
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  padding: 15px;
  margin: auto;

  @media (max-width: 500px) {
    padding: 10px;
  }

  .help-text {
    color: theme('color-text-2');
    margin: 0;
    text-align: center;
  }

  .preview {
    margin: 0 auto;
    cursor: pointer;
  }

  .next {
    border-radius: $border-radius-round;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
}
</style>
