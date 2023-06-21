<template>
  <Prompt class='delete-account' v-if='show'>
    <form @submit.prevent>
      <h2 class='heading'>Delete Account</h2>
      <p class='warning'>All data associated with your account will be permanently deleted! Please confirm your email address if you wish to proceed.</p>
      <div>
        <label>Confirm Email</label>
        <IconInput icon='mail' placeholder='Confirm email address' autocomplete='off' v-model='email' />
      </div>
      <OutlineButton @click='deleteAccount'>Delete Account</OutlineButton>
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

.delete-account {
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
    background: $color-bg-1;
    border-radius: 15px;
    padding: 15px;
    margin: auto;

    .icon-input {
      margin: 8px 0 0;
    }

    .heading {
      margin: 0;
    }

    .warning {
      color: $color-text-2;
      margin: 0 0 30px;
    }
  }
}
</style>