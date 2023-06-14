<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&family=Urbanist:wght@600&display=swap" rel="stylesheet">

  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang='scss'>
@import 'normalize.css';
@import './assets/base.scss';
@import './assets/main.scss';
</style>
