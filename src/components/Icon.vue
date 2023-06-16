<template>
  <i :='$attrs' :data-feather='$props.icon'></i>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import feather from 'feather-icons'

const props = defineProps(['icon'])

onMounted(feather.replace)
</script>

<style scoped lang='scss'>
@import '../assets/themes.scss';

svg.feather {
  width: 1.1em;
  height: 1.1em;

  &.primary {
    color: $color-text-1;
  }

  &.secondary {
    color: $color-text-2;
  }
}
</style>

