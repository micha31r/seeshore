<template>
  <div class='icon-input' ref='element'>
    <Icon class='secondary' :icon='$props.icon'/>
    <input :='$attrs' :value='modelValue' @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'

const element = ref(null)

defineExpose({ element })
defineEmits(['update:modelValue'])
defineProps(['icon', 'modelValue'])
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.icon-input {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  border: 1px solid theme('color-border-1');
  border-radius: $border-radius-2;
  padding: 10px;

  &:focus-within {
    border-color: theme('color-text-1');

    .feather {
      color: theme('color-text-1');
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
}
</style>