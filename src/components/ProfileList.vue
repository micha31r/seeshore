<template>
  <div class='profile-list' ref='element'>
    <div class='profile' v-for='(profile, index) in data' @click='$emit("itemClick", { profile, index })' >
      <Avatar width='35' height='35' :profile='profile'/>
      <p class='name'>{{ profile.full_name }}</p>
      <slot :profile='profile'></slot>
    </div>

    <p class='fallback' v-if='!data.length && fallback'>{{ fallback }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Avatar from './Avatar.vue'

const element = ref(null)

defineEmits(['itemClick'])
defineExpose({ element })
defineProps(['data', 'fallback'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
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
    color: theme('color-text-2');
    margin: auto;
  }
}
}
</style>