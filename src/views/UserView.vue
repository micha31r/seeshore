<template>
  <div class='grid'>
    <Navbar pageName='Users' />
    <div class='main'>
      <div class='qr-wrapper'>
        <Avatar :profile='store.profile' />
        <div class='qr' :style='`background-image: url("${qrURL}")`'></div>      
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { encodeData, rendererFuncA } from 'beautify-qrcode';
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Avatar from '../components/Avatar.vue'

const qrURL = ref('')

const qrcode = encodeData({
    text: store.profile.username,
    correctLevel: 0
});

qrURL.value = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  rendererFuncA(qrcode, {
    opacity: 100
  })
)

</script>

<style scoped lang='scss'>
@import '../assets/themes';

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.qr-wrapper {
  position: relative;
  display: flex;
  width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 100%;
  margin: auto;
  overflow: hidden;
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

.qr {
  flex: 1;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: invert(1);
}
</style>
