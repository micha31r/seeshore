<template>
  <div class='menu' ref='menu'>
    <AccentButton class='icon toggle' ref='button'>
      <slot name='buttonContent'></slot>
    </AccentButton>

    <div class='list' v-show='show' :style='`${align}: 0`'>
      <slot name='listContent'></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps(['align'])

const menu = ref(null)
const button = ref(null)
const show = ref(false)

onMounted(() => addEventListener('click', toggle))

onUnmounted(() => {
  removeEventListener('click', toggle)
})

function toggle (event) {
  if (button.value.element.contains(event.target)) {
    // Toggle if clicked within the toggle button
    show.value = show.value ? false : true
  } else if (!menu.value.contains(event.target)) {
    // Hide if clicked outside <Menu>
    show.value = false
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.menu {
  position: relative;

  .toggle {
    border-radius: $border-radius-round;
    margin: 0 0 0 auto;
  }

  .list:deep() {
    display: flex;
    gap: 5px;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 10px);
    width: max-content;
    border-radius: $border-radius-2;
    border: 1px solid theme('color-border-1');
    background: theme('color-bg-2');
    padding: 5px;
    margin: 0 0 0 auto;
    z-index: 1;


    & > * {
      width: 100%;
      border-radius: $border-radius-3;
      padding: 7px;
    }
  }
}
}
</style>