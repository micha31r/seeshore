<template>
  <div class='grid'>
    <Navbar pageName='Stories' />

    <div class='feed'>
      <Story v-for='data in groups' :data='data' />
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref, onMounted } from 'vue'
import store, { storeCache } from '../store'
import Navbar from '../components/Navbar.vue'
import Story from '../components/Story.vue'

const stories = ref([])
const groups = ref([])

onMounted(async () => {
  stories.value = await getStories()
  groups.value = groupStories(stories)
})

async function getStories () {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('sharing')
        .select(`
          story (
            id,
            profile (id, avatar_url, full_name),
            media_url
          )
        `)
        .eq('profile', store.profile.id)
      
      if (error) throw error

      return data.map(item => item.story)
    } catch (error) {
      console.error(error)
    }
  }, 'stories')
}

function groupStories(stories) {
  let groups = {}

  stories.value.forEach(item => {
    const key = item.profile.id

    if (!(key in groups)) {
      groups[key] = []
    }

    groups[key].push(item)
  })

  return groups
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

$nav-height: calc(1.1em + 15px + 15px * 2);

@include use-theme {
.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

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
}
</style>
