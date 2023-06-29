<template>
  <div class='grid'>
    <Navbar pageName='QR Code' />

    <div class='qr'>
      <div class='contact-card'>
        <!-- Profile information -->
        <ProfileList :data='[store.profile]'/>

        <!-- QR code -->
        <QRCode v-if='code' :data='code'/>

        <!-- Camera button -->
        <SolidButton class='open-camera' @click='toggleScanner'>Open Camera</SolidButton>
      </div>

      <!-- Scanner -->
      <div class='scanner' v-show='showScanner'>
        <video ref='video'></video>
        <SolidButton class='cancel' @click='toggleScanner'>Cancel</SolidButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import QrScanner from 'qr-scanner'
import { uuid } from 'vue-uuid'
import store, { forceExpire } from '../store'
import { supabase } from '../supabase'
import Navbar from '../components/Navbar.vue'
import QRCode from '../components/QRCode.vue'
import Avatar from '../components/Avatar.vue'
import ProfileList from '../components/ProfileList.vue'

const router = useRouter()
const URLPrefix = 'http://localhost:5173/scan/'
const lifespan = 86400000 // 24 hours
const code = ref('')
const showScanner = ref(false)
const video = ref(null)
const scanSize = 300

// UUID regex (Melvin George, 2021)
// https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
const UUIDRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

let qrScanner

onMounted(async () => {
  code.value = URLPrefix + await getFollowCode()

  qrScanner = new QrScanner(video.value, scanCallback, {
    highlightScanRegion: true,
    calculateScanRegion (video) {
      let minVideoDimension = video.videoHeight
      let minWindowDimension =  window.innerHeight

      if (video.videoWidth < video.videoHeight) {
        minVideoDimension = video.videoWidth
        minWindowDimension = window.innerWidth
      } 

      const scanRegionSize = scanSize / minWindowDimension * minVideoDimension

      return {
          x: (video.videoWidth - scanRegionSize) / 2,
          y: (video.videoHeight - scanRegionSize) / 2,
          width: scanRegionSize,
          height: scanRegionSize
      }
    }
  })

  qrScanner.setInversionMode('both')
})

onUnmounted(() => {
  qrScanner.stop()
})

async function scanCallback (result) {
  const uuid = result.data.split('/').at(-1)

  if (!UUIDRegex.test(uuid)) return

  const id = await getProfileFromCode(uuid)
  createFollowRequest(id)
}

async function toggleScanner () {
  showScanner.value = showScanner.value ? false : true
  if (showScanner.value) {
    qrScanner.start()
  } else {
    qrScanner.stop()
  }
}

async function getFollowCode () {
  const expireDateTime = new Date(Date.now() - lifespan).toISOString()

  // Get existing/valid code
  try {
    let { data, count, error } = await supabase
      .from('follow_codes')
      .select(`code`, { count: 'exact' })
      .eq('profile', store.profile.id)
      .gt('created_at', expireDateTime)

    if (error) throw error

    return count
      ? data[0].code
      : await createFollowCode()
  } catch (error) {
    console.error(error)
  }
}

async function createFollowCode () {
  try {
    const { data, error } = await supabase
      .from('follow_codes')
      .upsert({
        profile: store.profile.id,
        code: uuid.v4(),
        created_at: new Date()
      })
      .select(`code`)
      .single()

    if (error) throw error

    return data.code
  } catch (error) {
    console.error(error)
  }
}

async function getProfileFromCode (code) {
  try {
    const { data, error } = await supabase
      .from('follow_codes')
      .select(`profile`)
      .eq('code', code)
      .single()

    if (error) throw error

    return data.profile
  } catch (error) {
    console.error(error)
  }
}

async function createFollowRequest (id) {
  if (id == store.profile.id) return

  // Return to people page if already following
  if (await isFollowing(id)) {
    router.push({ name: 'people' })
    return
  }
    
  try {
    const { data, error } = await supabase
      .from('follow_requests')
      .upsert({
        following: id,
        profile: store.profile.id
      })
      .select()

    if (error) throw error

    forceExpire('pendingFollowing')

    router.push({ name: 'people' })
  } catch (error) {
    console.error(error)
  }
}

async function isFollowing (id) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`profile`)
      .eq('follower', store.profile.id)
      .eq('profile', id)

    if (error) throw error

    return !!data.length
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';
@import '../assets/main';

@include use-theme {
.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.qr {
  padding: 10px;
  margin: auto;
}

.contact-card {
  display: flex;
  flex-direction: column;
  width: max-content;
  gap: 15px;
  border-radius: $border-radius-1;
  margin: auto;
}

.profile-list:deep(.profile) {
  border: 1px solid theme('color-border-1');
  border-radius: $border-radius-round;
  padding: 5px 10px 5px 5px;
  margin: 0 auto;
  gap: 10px;
}

.open-camera {
  width: max-content;
  border-radius: $border-radius-round;
  margin: auto;
}

.scanner:deep() {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--app-height);
  background: theme('color-bg-1');
  z-index: 101; // appear above navbar

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .scan-region-highlight-svg {
    stroke: #FFF !important;
    stroke-width: 2px !important;
  }

  .cancel {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100px;
    border-radius: $border-radius-round;
    background: #FFF;
    color: #000;
  }
}
}
</style>
