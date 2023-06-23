<template>
  <div class='qr-code'>
    <div class='wrapper'>
      <Avatar :profile='store.profile' />
      <div class='image' :style='`background-image: url("${url}")`'></div>      
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, defineProps, onMounted } from 'vue'
import { encodeData, rendererFuncA } from 'beautify-qrcode';
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Avatar from '../components/Avatar.vue'

const props = defineProps(['data'])
const { data } = toRefs(props)
const url = ref('')

onMounted(() => {
  const qrcode = encodeData({
      text: data.value,
      correctLevel: 0
  })

  url.value = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    rendererFuncA(qrcode, {
      opacity: 100
    })
  )
})
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.wrapper {
  position: relative;
  display: flex;
  width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 100%;
  margin: auto;
  // overflow: hidden;
}

.avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  filter: blur(30px);
  opacity: 0.5;
}

.image {
  flex: 1;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: invert(1);
}
</style>
