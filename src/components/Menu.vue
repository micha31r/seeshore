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
import { ref, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineProps(['align'])

const router = useRouter()
const menu = ref(null)
const button = ref(null)
const show = ref(false)

onMounted(() => addEventListener('click', toggle))

router.beforeEach((to, from, next) => {
  removeEventListener('click', toggle)
  next()
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

.menu {
  position: relative;

  .toggle {
    border-radius: 100px;
    margin: 0 0 0 auto;
  }

  .list::v-deep {
    position: absolute;
    top: calc(100% + 10px);
    width: max-content;
    border-radius: 10px;
    border: 1px solid $color-border-1;
    background: $color-bg-2;
    padding: 5px;
    margin: 0 0 0 auto;
    z-index: 1;


    & > * {
      width: 100%;
      border-radius: 5px;
    }
  }
}
</style>