<template>
  <div class='main'>
    <link rel='preconnect' href='https://fonts.googleapis.com'>
    <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
    <link href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&family=Urbanist:wght@500;600&display=swap' rel='stylesheet'>

    <RouterView v-if='store.session && store.profile' />
    <Auth v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { supabase } from './supabase'
import store from './store'
import Auth from './components/Auth.vue'

const theme = ref('dark')

// Watch for theme changes (Mark Szabo, 2019) (mikemaccana, 2022)
// https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  changeTheme(event.matches ? 'dark' : 'light')
})

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  changeTheme('dark')
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  store.session = data.session

  if (store.session) {
    store.profile = await getProfile()
  }

  supabase.auth.onAuthStateChange((_, _session) => {
    store.session = _session
  })
})

function changeTheme (mode) {
  document.documentElement.dataset.theme = mode
}

async function getProfile() {
  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select(`id, full_name, avatar_url`)
      .eq('id', store.session.user.id)
      .single()

    if (error && status !== 406) {
      throw error
    }

    return data
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang='scss'>
@import 'normalize.css';
@import './assets/base.scss';
@import './assets/main.scss';
</style>
