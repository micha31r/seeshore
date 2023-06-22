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
    <Menu align='right'>
      <template #buttonContent>
        <Avatar :profile='store.profile' />
      </template>

      <template #listContent>
        <AccentButton class='icon-text' @click='$router.push({ name: "account" })'>
          <Icon icon='user'/>
          <span>Profile</span>
        </AccentButton>

        <AccentButton class='icon-text' @click='$router.push({ name: "qr" })'>
          <Icon icon='square'/>
          <span>Share QR Code</span>
        </AccentButton>

        <AccentButton class='icon-text' @click='toggle'>
          <Icon icon='log-out'/>
          <span>Log out</span>
        </AccentButton>
      </template>
    </Menu>

    <Prompt v-show='showLogoutPrompt' class='logout-prompt'>
      <div>
        <h2 class='heading'>Log out of Seeshore?</h2>
        <p class='info'>You can sign in again at any time.</p>
        <SolidButton @click='supabase.auth.signOut()'>Log out</SolidButton>
        <AccentButton @click='toggle'>Cancel</AccentButton>
      </div>
    </Prompt>
  </nav>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { supabase } from '../supabase'
import store from '../store'
import Avatar from './Avatar.vue'

function toggle () {
  showLogoutPrompt.value = showLogoutPrompt.value ? false : true
}

defineProps(['pageName'])
const showLogoutPrompt = ref(false)
</script>

<style scoped lang='scss'>
@import '../assets/themes';

$element-height: calc(1.1em + 15px);

nav {
  display: grid;
  position: sticky;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
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

nav::v-deep {
  .menu {
    .list {
      width: 200px;
    }
  }
}

.logout-prompt {
  background: $color-bg-1 !important;
}
</style>