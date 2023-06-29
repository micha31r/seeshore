<template>
  <Prompt class='delete-account' v-show='show'>
    <form @submit.prevent>
      <h3 class='heading'>Delete Account</h3>
      <p class='info'>All data associated with your account will be permanently deleted! Please confirm your email address if you wish to proceed.</p>
      
      <div>
        <label>Confirm Email</label>
        <IconInput icon='mail' placeholder='Confirm email address' autocomplete='off' v-model='email' />
      </div>

      <AccentButton @click='deleteAccount'>Delete Account</AccentButton>
      <SolidButton @click='show = false'>Cancel</SolidButton>
    </form>
  </Prompt>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import { supabase } from '../supabase'

const router = useRouter()
const email = ref('')
const show = ref(false)

function toggle () {
  show.value = show.value ? false : true
}

defineExpose({ toggle })

async function deleteAccount () {
  if (email.value != store.session.user.email) {
    return
  }

  try {
    const { error } = await supabase
      .rpc('delete_user')

    if (error) throw error

    supabase.auth.signOut()
    router.push('/')
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
.icon-input {
  margin: 8px 0 0;
}
}
</style>