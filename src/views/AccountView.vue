<template>
  <div class='grid'>
    <Navbar pageName='Profile' />

    <div class='account'>
      <!-- Account information -->
      <div class='account-info'>
        <div class='row'>
          <Avatar :profile='store.profile'/>
        </div>

        <div class='row'>
          <h3 class='name'>{{ store.profile.full_name }}</h3>
        </div>

         <div class='row'>
          <AccentButton class='friends' @click='$router.push({ name: "people" })'>
            <span>{{ followerCount }} Followers</span>
            <span>{{ followingCount }} Following</span>
          </AccentButton>
        </div>

        <div class='row'>
          <AccentButton class='edit' @click='toggleAccountEditor'>Edit Profile</AccentButton>
        </div>
      </div>

      <!-- Stories -->
      <div class='feed'>
        <Story v-for='frame in stories' :data='[frame]' :key='frame'>
          <template #default='{ story, index }'>
            <AccentButton class='likes' @click='toggleLikesList(story.likes)'>
              <Icon icon='heart' />
              <span v-if='story.likes'>{{ story.likes.length }}</span>
            </AccentButton>  

            <Menu align='right'>
              <template #buttonContent>
                <Icon icon='more-horizontal'/>
              </template>

              <template #listContent>
                <AccentButton class='icon-text' @click='deleteStory(story.id)'>
                  <Icon icon='trash-2'/>
                  <span>Delete</span>
                </AccentButton>
              </template>
            </Menu>
          </template>
        </Story>
      </div>

      <!-- Account settings -->
      <AccountEditor ref='accountEditor' @deleteAccount='toggleDeleteAccount'/>
      <DeleteAccount ref='deleteAccount' />

      <!-- Like prompt -->
      <Prompt v-if='showLikes'>
        <div class='like-profiles'>
          <h3 class='heading'>Liked By</h3>
          <ProfileList :data='likes' fallback='This story does not have any likes.'/>
          <AccentButton @click='toggleLikesList()'>Close</AccentButton>
        </div>
      </Prompt>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import store, { storeCache, forceExpire } from '../store'
import { isScrolledBottom } from '../utils'
import { getFollowerCount, getFollowingCount } from '../api'
import Paginator from '../pagination'
import Navbar from '../components/Navbar.vue'
import Story from '../components/Story.vue'
import Avatar from '../components/Avatar.vue'
import AccountEditor from '../components/AccountEditor.vue'
import DeleteAccount from '../components/DeleteAccount.vue'
import ProfileList from '../components/ProfileList.vue'

const paginator = new Paginator()
const stories = ref([])
const showAccountMenu = ref(false)
const likes = ref([])
const showLikes = ref(false)
const accountEditor = ref(null)
const deleteAccount = ref(null)
const followerCount = ref(0)
const followingCount = ref(0)

onMounted(async () => {
  stories.value = await getOwnStories()
  followerCount.value = await getFollowerCount()
  followingCount.value = await getFollowingCount()

  addEventListener('scroll', loadOnScroll)
})

onUnmounted(() => {
  removeEventListener('scroll', loadOnScroll)
})

async function loadOnScroll () {
  if (isScrolledBottom(document.documentElement)) {
    paginator.next()
    stories.value = stories.value.concat(await getOwnStories(true))
  }
}

function toggleLikesList (data = []) {
  showLikes.value = showLikes.value ? false : true
  likes.value = data
}

function toggleAccountEditor () {
  accountEditor.value.toggle()
}

function toggleDeleteAccount () {
  deleteAccount.value.toggle()
}

async function getOwnStories(append) {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          profile (id, avatar_url, full_name),
          media_url
        `)
        .eq('profile', store.profile.id)
        .order('created_at', { ascending: false })
        .range(...paginator.getRange())

      if (error) throw error

      // Load likes
      for (let i = 0; i < data.length; i++) {
        const item =  data[i]
        item.likes = await getLikeData(item)
      }

      return data
    } catch (error) {
      console.error(error)
    }
  }, 'ownStories', append)
}

async function getLikeData (story) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select(`
        profile (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('story', story.id)

    if (error) throw error

    // Set values to an array of profiles
    return data.map(item => item.profile)
  } catch (error) {
    console.error(error)
  }
}

async function deleteStory (id) {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Remove story from local feed
    const index = stories.value.findIndex(item => item.id == id)
    stories.value.splice(index, 1)
  } catch (error) {
    console.error(error)
  }
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

.account-info {
  display: flex;
  gap: 15px;
  flex-direction: column;
  padding: 30px 15px;

  @media (max-width: 500px) {
    gap: 10px;
    padding: 30px 10px;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin: 0 auto;

    & > * {
      margin: auto;
    }

    @media (max-width: 500px) {
      gap: 10px;
    }
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .friends {
    display: flex;
    gap: 15px;
    width: max-content;
    background: transparent;
    padding: 0;

    @media (max-width: 500px) {
      gap: 10px;
    }

    & > * {
      margin: auto 0;
    }
  }

  .edit {
    height: $nav-content-height;
    padding: 0 15px;
  }
}

.feed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
  padding: 15px;
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
    padding: 10px;
  }

  .meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;

    .likes {
      display: flex;
      gap: 7px;
      width: max-content;
      height: $nav-content-height;
      padding-top: 0;
      padding-bottom: 0;

      & > * {
        margin: auto 0;
      }

      .feather {
        stroke: theme('color-text-2');
        fill: theme('color-text-2');
      }
    }
  }

  .story:deep(.progress) {
    display: none;
  }
}

.like-profiles {
  display: grid;
  gap: 15px;
  grid-template-rows: auto 1fr auto;
  width: 400px;
  border: 1px solid theme('color-border-1');
  border-radius: $border-radius-1;
  background: theme('color-bg-1');
  padding: 15px;
  margin: auto;

  .heading {
    margin: 0;
  }

  .info {
    margin-bottom: auto;
  }

  .profile-list {
    height: 200px;
    overflow: auto;

    @media (max-width: 500px) {
      height: calc(100vh - var(--nav-height) - $nav-content-height - 90px);
    }
  }
}
}
</style>
