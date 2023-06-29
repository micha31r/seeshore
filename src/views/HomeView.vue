<template>
  <div class='grid'>
    <Navbar pageName='Stories' />

    <div class='wrapper'>
      <div class='feed' v-if='groups.length'>
        <Story v-for='[id, data] in groups' :data='data'>
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

      <p class='fallback' v-else-if='isLoaded'>No recent stories</p>

      <Loader ref='loader' />
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import store, { storeCache } from '../store'
import { isScrolledBottom } from '../utils'
import { getFollowing } from '../api'
import Navbar from '../components/Navbar.vue'
import Story from '../components/Story.vue'
import Avatar from '../components/Avatar.vue'

const groups = ref([])
const likes = ref([])
const app = document.querySelector('#app')
const loader = ref(null)
const isLoaded = ref(false) // Initial load

onMounted(async () => {
  groups.value = await getStoryGroups()
  likes.value = await getLikes(groups.value)
  isLoaded.value = true

  app.addEventListener('scroll', loadOnScroll)
})

onBeforeUnmount(() => {
  app.removeEventListener('scroll', loadOnScroll)
})

async function loadOnScroll () {
  if (isScrolledBottom(app)) {
    groups.value = groups.value.concat(await getStoryGroups({
      append: true,
      nextPage: true
    }))
    likes.value = await getLikes(groups.value)
  }
}

async function getLikes (groups) {
  let ids = []

  groups.forEach(([id, stories]) => {
    ids = ids.concat(stories.map(item => item.id))
  })

  try {
    loader.value.show('Loading likes')
    const { data, error } = await supabase
      .from('likes')
      .select(`story`)
      .eq('profile', store.profile.id)
      .in('story', ids)

    if (error) throw error

    return data.map(item => item.story)
  } catch (error) {
    console.error(error)
  } finally {
    loader.value.hide()
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

async function getStoryGroups (options = {}) {
  options = { name: 'stories', pageSize: 12, ...options }

  return await storeCache (async (paginator) => {
    const stories = []

    try {
      loader.value.show('Loading stories')
      const [ range_start, range_end ] = paginator.getRange()
      const { data, error } = await supabase
        .rpc('get_feed', { range_start, range_end })
        .select(`
          *,
          profile (id, avatar_url, full_name)
        `)

      if (error) throw error

      const group = data.reduce((group, story) => {
        const { profile } = story
        group[profile.id] = group[profile.id] ?? []
        group[profile.id].push(story)
        return group
      }, {})

      const stories = Object.entries(group).sort((a, b) => {
        return a[1][0].created_at - b[1][0].created_at
      })

      return stories
    } catch (error) {
      console.error(error)
    } finally {
      loader.value.hide()
    }
  }, options)
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

.wrapper {
  display: flex;
}

.feed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
  padding: 0 15px 15px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (max-width: 500px) {
    padding: 0 10px 10px;
  }

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

  .story:deep(.preview) {
    cursor: pointer;
  }
}

p.fallback {
  display: flex;
  width: max-content;
  margin: auto;
  color: theme('color-text-2');
  padding: 10px;
}
}
</style>
