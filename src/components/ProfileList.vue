<template>
  <div class='profile-list'>
    <div class='profile' v-for='(profile, index) in data'>
      <Avatar width='35' height='35' :profile='profile'/>
      <p class='name'>{{ profile.full_name }}</p>
    </div>

    <p class='fallback' v-if='!data.length && fallback'>{{ fallback }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import Avatar from './Avatar.vue'

defineProps(['data', 'fallback'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.profile-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .profile {
    display: flex;
    gap: 15px;

    & > * {
      margin: auto 0;
    }
  }

  .fallback {
    color: $color-text-2;
    margin: auto;
  }
}
</style>