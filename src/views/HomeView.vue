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
import { ref, onMounted, onUnmounted } from 'vue'
import store, { storeCache } from '../store'
import { isScrolledBottom } from '../utils'
import { getFollowing } from '../api'
import Navbar from '../components/Navbar.vue'
import Story from '../components/Story.vue'
import Avatar from '../components/Avatar.vue'

const groups = ref([])
const likes = ref([])
const app = document.querySelector('#app')

onMounted(async () => {
  const following = await getFollowingByActivity()
  groups.value = await getStoryGroups(following)
  likes.value = await getLikes(groups.value)

  app.addEventListener('scroll', loadOnScroll)
})

onUnmounted(() => {
  app.removeEventListener('scroll', loadOnScroll)
})

async function loadOnScroll () {
  if (isScrolledBottom(app)) {
    const following = await getFollowingByActivity({
      append: true,
      nextPage: true
    })
    groups.value = groups.value.concat(await getStoryGroups(following, {
      append: true 
    }))
    likes.value = await getLikes(groups.value)
  }
}

async function getLikes (stories) {
  let ids = []

  stories.forEach(group => {
    ids = ids.concat(group.map(story => story.id))
  })

  try {
    const { data, error } = await supabase
      .from('likes')
      .select(`story`)
      .eq('profile', store.profile.id)
      .in('story', ids)

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

async function getFollowingByActivity (options = {}) {
  options = { name: 'followingByActivity', pageSize: 12, ...options }

  return await storeCache (async (paginator) => {
    try {
      const [ range_start, range_end ] = paginator.getRange()
      const { data, error } = await supabase
        .rpc('get_profile_by_activity', { range_start, range_end })

      if (error) throw error

      return data
    } catch (error) {
      console.error(error)
    }
  }, options)
}

async function getStoryGroups (following, options = {}) {
  options = { name: 'stories', pageSize: 12, ...options }

  return await storeCache (async () => {
    const stories = []

    for (let i = 0; i < following.length; i++) {
      try {
        const { data, error } = await supabase
          .rpc('get_stories_from_following', { 
            following_id: following[i].id
          })
          .select(`
            *,
            profile (id, avatar_url, full_name)
          `)

        if (error) throw error

        stories.push(data)
      } catch (error) {
        console.error(error)
      }
    }

    // return stories
    return stories
  }, options)
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
}
</style>
