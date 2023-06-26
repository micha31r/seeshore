<template>
  <div class="main">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&family=Urbanist:wght@500;600&display=swap" rel="stylesheet">

    <RouterView v-if='store.session && store.profile' />
    <Auth v-else />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { supabase } from './supabase'
import store from './store'
import Auth from './components/Auth.vue'

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
</script>

<style lang='scss'>
@import 'normalize.css';
@import './assets/base.scss';
@import './assets/main.scss';
</style>
