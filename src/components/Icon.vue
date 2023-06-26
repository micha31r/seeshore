<template>
  <i :='$attrs' :data-feather='$props.icon' ref='element'></i>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import feather from 'feather-icons'

const props = defineProps(['icon'])
const element = ref(null)

defineExpose({ element })

onMounted(feather.replace)
</script>

<style scoped lang='scss'>
@import '../assets/themes.scss';

@include use-theme {
svg.feather {
  width: 1.1em;
  height: 1.1em;

  &.primary {
    color: theme('color-text-1');
  }

  &.secondary {
    color: theme('color-text-2');
  }
}
}
</style>

