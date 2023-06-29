<template>
  <form @submit.prevent>
    <h1>Log In</h1>

    <div>
      <label>Email</label>
      <IconInput type='email' v-model='email' placeholder='you@example.com' icon='mail' required/>
    </div>

    <SolidButton class='submit solid' @click='OTPLogin' :disabled='OTPState != 0'>
      <template v-if='OTPState == 0'>Get Magic Link</template>
      <template v-else-if='OTPState == 1'>Sending...</template>
      <template v-else>Check Your Inbox</template>
    </SolidButton>
    
    <!-- <OutlineButton class='oauth outline' @click.submit.prevent='GoogleLogin'>Continue with Google</OutlineButton> -->
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const OTPState = ref(0)
const email = ref('')

async function OTPLogin() {
  if (!email.value) return

  try {
    OTPState.value = 1;
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: false
      }
    })

    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    OTPState.value = 2;
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

  h1 {
    margin: 0 0 20px;
  }

  .icon-input {
    margin: 8px 0 0;
  }
}
}
</style>