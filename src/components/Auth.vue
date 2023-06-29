<template>
  <form @submit.prevent>
    <h2 class='heading'>Sign In</h2>

    <div>
      <label>Email</label>
      <IconInput type='email' v-model='email' placeholder='you@example.com' icon='mail' required @change='state = 0' />
    </div>

    <SolidButton class='submit solid' @click='OTPLogin' :disabled='state != 0'>
      <template v-if='state == 0'>Send magic link</template>
      <template v-else-if='state == 1'>Loading...</template>
      <template v-else-if='state == 2'>Link has been sent</template>
      <template v-else-if='state == 3'>You don't have access</template>
      <template v-else-if='state == 4'>Too many attempts</template>
    </SolidButton>
    
    <!-- <OutlineButton class='oauth outline' @click.submit.prevent='GoogleLogin'>Continue with Google</OutlineButton> -->
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const state = ref(0)
const email = ref('')

async function OTPLogin() {
  if (!email.value) return

  try {
    state.value = 1; // Sending
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: false
      }
    })

    if (error) throw error

    state.value = 2; // Success
  } catch (error) {
    console.error(error.message)

    if (error.status === 400) {
      state.value = 3 // Sign up error
    } else if (error.status === 429) {
      state.value = 4 // Too many attempts
    }
  }
}

// async function GoogleLogin () {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       shouldCreateUser: false
//     }
//   })
// }
</script>

<style scoped lang='scss'>
@import '../assets/themes';

@include use-theme {
form {
  display: grid;
  gap: 10px;
  width: 400px;
  max-width: 100%;
  margin: auto;
  padding: 15px;

  @media (max-width: 500px) {
    padding: 10px;
  }

  .heading {
    margin: 0 0 20px;
  }

  .icon-input {
    margin: 8px 0 0;
  }
}
}
</style>