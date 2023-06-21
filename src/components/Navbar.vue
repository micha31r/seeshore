<template>
  <nav>
    <!-- Home button -->
    <AccentButton class='icon home' @click="$router.push('/')">
      <Icon class='secondary' icon='home' />
    </AccentButton>

    <!-- Page name -->
    <h3 class='page-name'>{{ pageName }}</h3>

    <!-- Add story button -->
    <SolidButton class='solid add-story' @click="$router.push('/create')">Add Story</SolidButton>

    <!-- Profile -->
    <Avatar @click="$router.push('/account')" :media='store.profile.avatar_url'/>
  </nav>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import store from '../store'
import Avatar from './Avatar.vue'

const props = defineProps(['pageName'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';
$element-height: calc(1.1em + 15px);

nav {
  display: grid;
  position: sticky;
  grid-template-columns: auto 1fr auto auto;
  gap: 15px;
  height: max-content;
  top: 0;
  background: rgba($color-theme-2-shade-15, $shade-2);
  backdrop-filter: blur(20px);
  padding: 15px;
  z-index: 100;

  .page-name {
    font-weight: normal;
    margin: auto 0;
  }

  button.home {
    height: $element-height;
  }

  button.add-story {
    padding: 0 15px;
    border-radius: 100px;
    height: $element-height;
  }

  .avatar {
    cursor: pointer;
  }
}
</style>