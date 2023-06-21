<template>
  <Prompt class='account-editor' v-if='show'>
    <form class='profile-form' @submit.prevent>
      <h2 class='heading'>Edit Profile</h2>

      <!-- Image selector -->
      <div class='avatar'></div>

      <!-- Form fields -->
      <div>
        <label>Name</label>
        <IconInput icon='user' placeholder='Name' v-model='name' />
      </div>

      <div>
        <label>Email</label>
        <IconInput icon='mail' placeholder='Email' v-model='email' />
      </div>

      <!-- Save and cancel -->
      <SolidButton @click='updateProfile'>Save Changes</SolidButton>
      <AccentButton @click='toggle'>Cancel</AccentButton>

      <!-- Delete account button -->
      <a class='delete' @click='$emit("deleteAccount"); toggle();'>Delete Account</a>
    </form>
  </Prompt>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import store from '../store'
import { supabase } from '../supabase'

const email = ref('')
const name = ref('')
const show = ref(false)

function toggle () {
  show.value = show.value ? false : true
}

defineExpose({ toggle })

function setInitialValues () {
  name.value = store.profile.full_name
  email.value = store.session.user.email
}

onMounted(setInitialValues)

async function updateProfile () {
  // Update profile
  if (name.value != store.profile.full_name) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: name.value
        })
        .eq('id', store.profile.id)
        .select(`id, username, full_name`)
        .single()

      if (error) throw error

      store.profile = data
    } catch (error) {
      console.error(error)
    }
  }

  // Update user
  if (email.value != store.session.user.email) {
    try {
      const { error } = await supabase
        .auth
        .updateUser({
          email: email.value
        })

      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  setInitialValues()
  toggle()
}
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.account-editor {
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
    background: $color-bg-1;
    border-radius: 15px;
    padding: 15px;
    margin: auto;

    .heading {
      margin: 0;
    }

    .avatar {
      display: block;
      width: 150px;
      height: 150px;
      border-radius: 100%;
      background: $color-bg-2;
      margin: 10px auto;
      cursor: pointer;
    }

    .icon-input {
      margin: 8px 0 0;
    }

    .delete {
      font-size: 0.8em;
      display: block;
      width: max-content;
      color: $color-text-2;
      margin: 10px auto 0;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>

