<!-- Render components if user is authenticated -->

<template>
  <slot v-if='store.session' :session='store.session' />
  <Auth v-else />
</template>

<script setup>
import store from '../store'
import Auth from './Auth.vue'
</script>
