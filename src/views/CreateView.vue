<template>
  <div class='grid'>
    <Navbar pageName='Create' />

    <div class='editor'>
      <p class='help-text'>Tap to add media.</p>
      <Preview @mousedown='addText' @mouseup='getFile' :type='store.editor.type' :media='store.editor.previewURL' />
      <SolidButton class='next' @click="$router.push('/share')" :disabled='!store.editor.file'>Next</SolidButton>
    </div>
  </div>
</template>

<script setup>
import store from '../store'
import { toBase64 } from '../utils'
import { onHold, onTap } from '../touch'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'

function getFile(event) {
  onTap(async (event) => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'images',
          accept: {
            'image/jpeg': '.jpg',
            'image/jpeg': '.jpeg',
            'image/webp': '.webp',
            'image/png': '.png'
          },
        },
      ],
      excludeAcceptAllOption: true
    })

    const file = await fileHandle.getFile()
    const type = file.type.split('/')[0]

    // Generate preview URL
    let url;
    if (type == 'image') {
      url = await toBase64(file);
    }

    store.editor.previewURL = url;
    store.editor.file = file
    store.editor.type = type
  })
}

function addText(event) {
  onHold((event) => {
    console.log('Future feature.')
  })
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

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
  width: max-content;
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
    width: 400px;
    height: 560px;
    margin: 0 auto;
    cursor: pointer;
  }

  .next {
    border-radius: 100px;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
}
</style>
