<template>
  <div class='grid'>
    <Navbar pageName='QR Code' />
    <div class='qr'>
      <div class='contact-card'>
        <QRCode />

        <div class='profile'>
          <ProfileList :data='[store.profile]' fallback='This story does not have any likes.'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import QRCode from '../components/QRCode.vue'
import Avatar from '../components/Avatar.vue'
import ProfileList from '../components/ProfileList.vue'
import store from '../store'
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

.profile::v-deep {
  border: 1px solid $color-border-1;
  border-radius: 100px;
  padding: 10px 15px 10px 10px;
  margin: 0 auto;

  .profile-list .profile {
    gap: 10px;
  }
}
</style>
