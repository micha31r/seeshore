<template>
  <div class='grid'>
    <Navbar pageName='Stories' />

    <div class='feed'>
      <Story v-for='data in groups' :data='data'>
        <template #default='{ story, index }'>
          <!-- Profile -->
          <div class='profile'>
            <Avatar :profile='story.profile' />
            <p class='name'>{{ story.profile.full_name }}</p>
          </div>

          <!-- Like button -->
          <AccentButton class='icon like' @click='toggleLike(story)' :data-is-liked='likes.indexOf(story.id) > -1'>
            <Icon icon='heart'/>
          </AccentButton>
        </template>
      </Story>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref, onMounted } from 'vue'
import store, { storeCache } from '../store'
import Navbar from '../components/Navbar.vue'
import Story from '../components/Story.vue'
import Avatar from '../components/Avatar.vue'

const stories = ref([])
const groups = ref([])
const likes = ref([]) // Array of liked story ids

onMounted(async () => {
  stories.value = await getStories()
  groups.value = groupStories(stories)
  likes.value = await getLikes()
})

async function getLikes () {
  const storyIds = stories.value.map(item => item.id)

  try {
    const { data, error } = await supabase
      .from('likes')
      .select(`story`)
      .eq('profile', store.profile.id)
      .in('story', storyIds)

    if (error) throw error

    return data.map(item => item.story)
  } catch (error) {
    console.error(error)
  }
}

async function toggleLike (story) {
  const likeIndex = likes.value.indexOf(story.id)

  try {
    if (likeIndex > -1) {
      // Remove like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('story', story.id)
        .eq('profile', store.profile.id)

      if (error) throw error

      likes.value.splice(likeIndex, 1)

    } else {
      // Add like
      const { error } = await supabase
        .from('likes')
        .insert({
          story: story.id,
          profile: store.profile.id
        })

      if (error) throw error
      
      likes.value.push(story.id)
    }
  } catch (error) {
    console.error(error)
  }
}

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
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
  padding: 0 15px 15px;
  margin: 0 auto;

  .meta {
    .profile {
      display: flex;
      gap: 10px;

      .name {
        margin: auto 0;
      }
    }

    button.like {
      margin: auto 0 auto auto;

      &[data-is-liked='true'] .feather {
        fill: theme('color-bg-1-invert');
      }
      
      .feather {
        color: theme('color-text-1');
      }
    }
  }

  .story::v-deep .preview {
    cursor: pointer;
  }
}
}
</style>
