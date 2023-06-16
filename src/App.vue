<template>
  <div class="main">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&family=Urbanist:wght@500;600&display=swap" rel="stylesheet">

    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { supabase } from './supabase'
import store from './store'

async function getProfile() {
  if (!store.session) return

  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select(Object.keys(store.profile).join())
      .eq('id', store.session.user.id)
      .single()

    if (error && status !== 406) {
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}

onMounted(() => {
  supabase.auth.getSession().then(async ({ data }) => {
    store.session = data.session
    store.profile = await getProfile()
  })

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
