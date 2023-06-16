<template>
  <div class='feed'>
    <Story v-for='story in stories' :data='story' />
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref } from 'vue'
import store from '../store'
import Story from './Story.vue'

const stories = ref([
  {
    name: 'Michael',
    chapters: [{}, {}, {}, {}]
  },
  {
    name: 'Loak',
    chapters: [{}]
  },
  {
    name: 'Jake',
    chapters: [{}, {}, {}]
  },
  {
    name: 'Spider',
    chapters: [{}, {}, {}]
  }
])
</script>

<style scoped lang='scss'>
$nav-height: calc(1.1em + 15px + 15px * 2);

.feed {
    display: grid;
    gap: 15px;
    padding: 0 15px 15px;
    margin: 0 auto;

    .story {
      width: 500px;
      height: 700px;
    }
}
</style>