<template>
  <Prompt class='account-editor' v-if='show'>
    <form @submit.prevent>
      <h3 class='heading'>Edit Profile</h3>

      <!-- Image selector -->
      <div>
        <label>Avatar</label>
        <Avatar width='150' height='150' :profile='store.profile' ref='avatar'>
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
const avatar = ref(null)
const newAvatar = ref(null)
const hasAvatarChanged = ref(false)
const avatarPreview = ref('')

defineExpose({ toggle })
onMounted(setInitialValues)

function toggle () {
  show.value = show.value ? false : true
}

function updateAvatarPreview (url) {
  avatar.value.element.style.backgroundImage = `url('${url}')`
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

function setInitialValues () {
  name.value = store.profile.full_name
  email.value = store.session.user.email
}

async function updateProfile () {
  let newAvatarURL = null

  if (hasAvatarChanged.value) {
    // Upload new avatar
    if (newAvatar.value) {
      const path = joinPaths([store.profile.id, uuid.v4()]) // without extension
      newAvatarURL = (await uploadImage('avatars', path + '.jpg', newAvatar.value, {
        quality: 0.2,
        width: 400,
        height: 400,
        resize: 'cover'
      })).path
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
      .select(`id, full_name, avatar_url`)
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

@include use-theme {
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
    width: max-content;
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
  color: theme('color-text-2');
  margin: 10px auto 0;
  text-align: center;
  cursor: pointer;
}
}
</style>

