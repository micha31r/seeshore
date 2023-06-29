<template>
  <div class='auth'>
    <section>
      <p class='heading'>Seeshore</p>
      <p>Seeshore (see and share) is a tiny social media platform for sharing photo stories <a class='hidden-link' href='https://www.instagram.com/micha31r/' target='_blank'><Icon icon='smile' /></a> with friends • personal project • invite only</p>
    </section>

    <section>
      <p class='heading'>Sign In</p>

      <form @submit.prevent>
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
    </section>
  </div>
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
.auth {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 450px;
  max-width: 100%;
  margin: auto;
  padding: 15px;

  @media (max-width: 500px) {
    padding: 10px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
      color: theme('color-text-2');
      margin: 0;

      &.heading {
        color: theme('color-text-1');
      }
    }

    a {
      color: theme('color-text-2');

      &:hover {
        color: theme('color-text-1');
      }
    }

    .hidden-link {
      outline: 0;
    }

    .feather.feather-smile {
      transform: rotate(20deg);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .icon-input {
        margin: 8px 0 0;
      }
    }
  }
}
}
</style>