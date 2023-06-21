<template>
  <Prompt class='account-editor' v-if='show'>
    <form class='profile-form' @submit.prevent>
      <h2 class='heading'>Edit Profile</h2>

      <!-- Image selector -->
      <div>
        <label>Avatar</label>
        <Avatar width='150' height='150' :profile='store.profile' id='editor-avatar'>
            <div class='options'>
             <OutlineButton @click='changeAvatar'>
                <Icon icon='edit-3'/>
                <span>Edit</span>
              </OutlineButton>

              <OutlineButton @click='preDeleteAvatar'>
                <Icon icon='trash-2'/>
                <span>Remove</span>
              </OutlineButton>
            </div>
        </Avatar>
      </div>

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
import { uuid } from 'vue-uuid'
import store from '../store'
import { supabase } from '../supabase'
import Avatar from './Avatar.vue'
import { isValidURL, toBase64, selectFile, joinPaths } from '../utils'
import { uploadImage } from '../upload'

const email = ref('')
const name = ref('')
const show = ref(false)
const newAvatar = ref(null)
const hasAvatarChanged = ref(false)
const avatarPreview = ref('')

function updateAvatarPreview (url) {
  const avatar = document.querySelector('#editor-avatar')
  avatar.style.backgroundImage = `url('${url}')`
}

async function changeAvatar (event) {
  const { file, type } = await selectFile()

  if (type == 'image') {
    newAvatar.value = file
    hasAvatarChanged.value = true
    updateAvatarPreview(await toBase64(file)) // Generate preview
  }
}

function preDeleteAvatar () {
  updateAvatarPreview('none')
  newAvatar.value = null
  hasAvatarChanged.value = true
}

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
  let newAvatarURL = null

  if (hasAvatarChanged.value) {
    // Delete old avatar file
    if (!isValidURL(store.profile.avatar_url)) {
      try {
        const { error } = await supabase
          .storage
          .from('avatars')
          .remove([store.profile.avatar_url])

        if (error) throw error
      } catch (error) {
        console.error(error)
      }
    }

    // Upload new avatar
    if (newAvatar.value) {
      const path = joinPaths([store.profile.id, uuid.v4()]) // without extension
      newAvatarURL = (await uploadImage('avatars', path + '.jpg', newAvatar.value)).path
    }
  }

  // Update profile
  try {
    const newData = {
      full_name: name.value
    }

    if (hasAvatarChanged.value) {
      newData.avatar_url = newAvatarURL
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(newData)
      .eq('id', store.profile.id)
      .select(`id, username, full_name, avatar_url`)
      .single()

    if (error) throw error

    store.profile = data
  } catch (error) {
    console.error(error)
  }

  // Update user
  // Supabase will automatically send a verification email
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
    border: 1px solid $color-border-1;
    border-radius: 15px;
    padding: 15px;
    margin: auto;

    .heading {
      margin: 0;
    }

    .avatar {
      position: relative;
      margin: 8px auto 0;
      cursor: pointer;

      .options {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translate(-50%, 0);
        display: flex;
        gap: 5px;
      }

      button {
        font-size: 0.8em;
        display: flex;
        gap: 7px;
        padding: 7px;

        & > * {
          margin: auto 0;
        }
      }
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

