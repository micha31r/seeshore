<template>
  <nav ref='nav'>
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

        <AccentButton class='icon-text' @click='setTheme'>
          <template v-if='store.theme == "dark"'>
            <Icon icon='sun'/>
            <span>Light Mode</span>
          </template>
          <template v-else>
            <Icon icon='moon'/>
            <span>Dark Mode</span>
          </template>
          
        </AccentButton>

        <AccentButton class='icon-text' @click='toggle'>
          <Icon icon='log-out'/>
          <span>Log out</span>
        </AccentButton>
      </template>
    </Menu>

    <Prompt v-show='showLogoutPrompt' class='logout-prompt'>
      <div>
        <h3 class='heading'>Log out of Seeshore?</h3>
        <p class='info'>You can sign in again at any time.</p>
        <SolidButton @click='supabase.auth.signOut()'>Log out</SolidButton>
        <AccentButton @click='toggle'>Cancel</AccentButton>
      </div>
    </Prompt>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import store from '../store'
import Avatar from './Avatar.vue'

defineProps(['pageName'])

const root = document.querySelector(':root')
const nav = ref(null)
const showLogoutPrompt = ref(false)

onMounted(() => {
  getNavHeight()
  addEventListener('resize', getNavHeight)
})

onUnmounted(() => {
  removeEventListener('resize', getNavHeight)
})

function getNavHeight () {
  root.style.setProperty('--nav-height', nav.value.clientHeight + 'px')
}

function toggle () {
  showLogoutPrompt.value = showLogoutPrompt.value ? false : true
}

function setTheme () {
  store.theme = store.theme == 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = store.theme
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
nav {
  display: grid;
  position: sticky;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  height: max-content;
  top: 0;
  background: theme('color-bg-1');
  padding: 15px;
  z-index: 100;

  @media (max-width: 500px) {
    padding: 10px;
  }

  .page-name {
    font-weight: normal;
    margin: auto 0;
  }

  button.home {
    height: $nav-content-height;
  }

  button.add-story {
    padding: 0 15px;
    border-radius: $border-radius-round;
    height: $nav-content-height;
  }

  .avatar {
    cursor: pointer;
  }
}

nav:deep() {
  .menu {
    @media (max-width: 500px) {
      position: static;
    }

    .list {
      width: 200px;

      @media (max-width: 500px) {
        top: calc($nav-content-height + 20px);
        width: 100vw;
        border: 0;
        border-radius: 0;
        z-index: -1;
      }
    }
  }

  @media (max-width: 500px) {
    .prompt {
      z-index: -1;
    }
  }
}

.logout-prompt {
  background: theme('color-bg-1') !important;
}
}
</style>