<template>
  <div class='story'>
    <div class='meta'>
      <div class='profile'>
        <Avatar :profile='data[0].profile' />
        <p class='name'>{{ data[0].profile.full_name }}</p>
      </div>

      <div class='progress'>
        <span class='dot' v-for='(_, index) in data' :data-on='currentIndex == index'></span>
      </div>

      <AccentButton class='icon like' @click='like' :data-has-liked='likes.indexOf(data[currentIndex].id) >= 0'>
        <Icon icon='heart'/>
      </AccentButton>
    </div>

    <Preview type='image' v-if='images[currentIndex]' :media='images[currentIndex]' blur='true' @click='cycle' :key='currentIndex'/>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import { supabase, download } from '../supabase'
import store from '../store'
import Preview from './Preview.vue'
import Avatar from './Avatar.vue'

const props = defineProps(['data'])
const { data } = toRefs(props)
const currentIndex = ref(0)
const images = ref([])
const likes = ref([])

function preload () {
  data.value.forEach(async item => {
    images.value.push(await download('images', item.media_url))

    const data = await getLikeStatus(item.id)
    if (data) {
      likes.value.push(data.story)
    }
  })
}

function cycle () {
  (currentIndex.value) < data.value.length - 1
    ? currentIndex.value++ 
    : currentIndex.value = 0
}

async function getLikeStatus (id) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select(`id, story, profile`)
      .eq('story', id)
      .eq('profile', store.profile.id)

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error(error)
  }
}

async function like () {
  const story = data.value[currentIndex.value]
  const likeIndex = likes.value.indexOf(story.id)

  try {
    if (likeIndex >= 0) {
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
      const { data, error } = await supabase
        .from('likes')
        .insert({
          story: story.id,
          profile: store.profile.id
        })
        .select(`id, story, profile`)
        .single()

      if (error) throw error
      
      likes.value.push(story.id)
    }
  } catch (error) {
    console.error(error)
  }
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

      &[data-has-liked='true'] .feather {
        fill: $color-bg-1-invert;
      }
      
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