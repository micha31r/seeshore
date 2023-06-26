<template>
  <div class='radio-input' @click='toggle' :data-checked='data' ref='element'></div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import feather from 'feather-icons'

const props = defineProps(['checked'])
const { checked } = toRefs(props)
const data = ref(checked.value || false)
const element = ref(null)

defineExpose({ element })
onMounted(feather.replace)

function toggle(event) {
  event.stopPropagation()
  data.value = data.value ? false : true
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.radio-input {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid $color-border-1;
  border-radius: 100%;

  &[data-checked='true']::after {
    background: $color-bg-1-invert;
  }
}

.radio-input::after {
  content: '';
  position: absolute;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
}
</style>