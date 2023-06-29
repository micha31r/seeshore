<template>
  <div class='loader-wrapper' v-show='isVisible' ref='element'>
    <div class='loader'>
      <p>{{ message }}</p>
      <Icon icon='loader' />
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
const props = defineProps(['show', 'message'])
const defaults = toRefs(props)
const isVisible = ref(defaults.show.value || false)
const message = ref(defaults.message.value || 'Loading')
const element = ref(null)

defineExpose({ element, toggle, show, hide })

// Prevent user from leaving page while loading
onBeforeRouteLeave((to, from , next) => {
  if (isVisible.value) {
    next(false)
  } else {
    next()
  }
})

function toggle () {
  isVisible.value = isVisible.value
    ? false
    : true
}

function show () {
  isVisible.value = true
}

function hide () {
  isVisible.value = false
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@include use-theme {
.loader-wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: max-content;
  max-width: 100%;
  padding: 15px;

  @media (max-width: 500px) {
    padding: 10px;
  }

  .loader {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: max-content;
    max-width: 100%;
    background: theme('color-bg-1');
    border: 1px solid theme('color-border-1');
    border-radius: $border-radius-2;
    padding: 10px;

    p {
      color: theme('color-text-2');
      margin: 0;
    }

    .feather {
      color: theme('color-text-2');
      animation: rotate 1s linear infinite;
      margin: auto 0;
    }
  }
}
}

</style>