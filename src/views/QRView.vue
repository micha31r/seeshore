<template>
  <div class='grid'>
    <Navbar pageName='QR Code' />
    <div class='qr'>
      <div class='contact-card'>
        <ProfileList :data='[store.profile]' fallback='This story does not have any likes.'/>

        <QRCode v-if='code' :data='code'/>

        <SolidButton class='open-camera' @click='toggleScanner'>Open Camera</SolidButton>
      </div>

      <div class='scanner' v-show='showScanner'>
        <video ref='video'></video>
        <SolidButton class='cancel' @click='toggleScanner'>Cancel</SolidButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import QrScanner from 'qr-scanner'
import { uuid } from 'vue-uuid'
import store from '../store'
import { supabase } from '../supabase'
import Navbar from '../components/Navbar.vue'
import QRCode from '../components/QRCode.vue'
import Avatar from '../components/Avatar.vue'
import ProfileList from '../components/ProfileList.vue'

const router = useRouter()
const URLPrefix = 'http://localhost:5173/scan/'
const lifespan = 1000 * 60 * 60 * 24 // 24 hours
const code = ref('')
const showScanner = ref(false)
const video = ref(null)
const overlay = ref(null)

// UUID regex (Melvin George, 2021)
// https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
const UUIDRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

let qrScanner

router.beforeEach((to, from, next) => {
  qrScanner.stop()
  next()
})

onMounted(async () => {
  code.value = URLPrefix + await getFollowCode()

  qrScanner = new QrScanner(video.value, scanCallback, {
    highlightScanRegion: true
  })

  qrScanner.setInversionMode('both')
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

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.qr {
  margin: auto;
}

.contact-card {
  display: flex;
  flex-direction: column;
  width: max-content;
  gap: 15px;
  border-radius: 15px;
  margin: auto;
}

.profile-list::v-deep .profile {
  border: 1px solid $color-border-1;
  border-radius: 100px;
  padding: 5px 10px 5px 5px;
  margin: 0 auto;
  gap: 10px;
}

.open-camera {
  width: max-content;
  border-radius: 100px;
  margin: auto;
}

.scanner::v-deep {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: $color-bg-1;
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
    border-radius: 100px;
  }
}
</style>
