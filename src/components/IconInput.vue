<template>
  <div class='icon-input' ref='element'>
    <Icon class='secondary' :icon='$props.icon'/>
    <input :='$attrs' :value='modelValue' @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'

const element = ref(null)

defineExpose({ element })
defineEmits(['update:modelValue'])
defineProps(['icon', 'modelValue'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.icon-input {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  border: 1px solid $color-border-1;
  border-radius: 10px;
  padding: 10px;

  &:focus-within {
    border-color: $color-text-1;

    .feather {
      color: $color-text-1;
    }
  }

  input {
    min-width: 0;
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    padding: 0;
    outline: 0;
    text-indent: 0;
  }

  .feather {
    margin: auto;
  }
}
</style>