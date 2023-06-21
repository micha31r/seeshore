<template>
  <div class='story'>
    <div class='meta'>
      <div class='profile'>
        <div class='avatar'></div>
        <p class='name'>{{ data[0].profile.full_name }}</p>
      </div>

      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='currentIndex == index'></span>
      </div>

      <AccentButton class='icon like'>
        <Icon icon='heart' />
      </AccentButton>
    </div>

    <Preview type='image' v-if='images[currentIndex]' :media='images[currentIndex]' blur='true' @click='cycle' :key='currentIndex'/>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import { supabase, download } from '../supabase'
import Preview from './Preview.vue'

const props = defineProps(['data'])
const { data } = toRefs(props)
const currentIndex = ref(0)
const url = ref('')

const images = ref([])

function preload () {
  data.value.forEach(async item => {
    images.value.push(await download('images', item.media_url))
  })
}

function cycle () {
  (currentIndex.value) < data.value.length - 1
    ? currentIndex.value++ 
    : currentIndex.value = 0
}

onMounted(preload)
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.story {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 15px;
  width: 100%;
  height: 100%;
  background: $color-bg-2;
  border-radius: 15px;
  padding: 15px;
  overflow: hidden;

  .meta {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;

    .profile {
      display: flex;
      gap: 10px;

      .avatar {
        display: block;
        width: 40px;
        height: 40px;
        border: 1px solid $color-border-1;
        border-radius: 100%;
        background: $color-bg-2;
      }

      .name {
        margin: auto 0;
      }
    }

    .progress {
      display: flex;
      gap: 5px;
      margin: auto;

      .dot {
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 100%;
        background: rgba($color-theme-2, $shade-3);

        &[data-on='true'] {
          background: $color-theme-2;
        }
      }
    }

    button.like {
      margin: auto 0 auto auto;

      .feather {
        color: $color-text-1;
      }
    }
  }

  .preview {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  // .blur {
  //   // position: absolute;
  //   filter: blur(20px);
  // }
}
</style>