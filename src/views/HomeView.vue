<template>
  <Protect>
    <div class='grid'>
      <Navbar pageName='Stories' />
      <Feed />
    </div>
  </Protect>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Feed from '../components/Feed.vue'
</script>

<style scoped lang='scss'>
.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}
</style>
