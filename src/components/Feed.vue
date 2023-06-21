<template>
  <div class='feed'>
    <Story v-for='data in stacks' :data='data' />
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref, onMounted } from 'vue'
import store from '../store'
import Story from './Story.vue'

const stacks = ref([])

async function getStories () {
  let stories = []

  // Get own stories
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id,
        profile (id, avatar_url, full_name),
        media_url
      `)
      .eq('profile', store.profile.id)
      .order('id', { ascending: false })

    if (error) throw error

    stories = data;
  } catch (error) {
    console.error(error)
  }

  // Get other stories
  try {
    const { data, error } = await supabase
      .from('sharing')
      .select(`
        profile,
        story (
          id,
          profile (id, avatar_url, full_name),
          media_url
        )
      `)
      .eq('profile', store.profile.id)
    
    if (error) throw error

    data.forEach(item => stories.push(item.story))
  } catch (error) {
    console.error(error)
  }

  return stories
}

function sortStories(stories) {
  let sorted = {}

  stories.forEach(item => {
    const id = item.profile.id

    if (!(id in sorted)) {
      sorted[id] = []
    }

    sorted[id].push(item)
  })

  return sorted
}

onMounted(async () => {
  const stories = await getStories()
  stacks.value = Object.values(sortStories(stories))
})
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