<template>
  <div class='grid'>
    <Navbar pageName='Profile' />

    <div class='account'>
      <div class='account-info'>
        <div class='avatar'></div>
        <p class='name'>{{ store.profile.full_name }}</p>
        <AccentButton class='edit-profile' @click='showProfileForm = true'>Edit</AccentButton>
        <AccentButton class='friends'>
          <Icon icon='users'/>
          <span>37</span>
        </AccentButton>
        <OutlineButton class='logout' @click='supabase.auth.signOut()'>Logout</OutlineButton>
      </div>

      <div class='stories'>
        <Preview type='image' :media='story.media_url' v-for='story in stories' @mouseleave='menuState = -1'>
          <div class='options'>
            <AccentButton class='icon menu-toggle' @click='menuState = story.id'>
              <Icon icon='more-horizontal'/>
            </AccentButton>

            <div class='menu' v-show='menuState == story.id'>
              <AccentButton class='delete' @click='deleteStory(story.id)'>
                <Icon icon='trash-2'/>
                <span>Delete</span>
              </AccentButton>
            </div>
          </div>
        </Preview>
      </div>

      <div class='prompt account-editor' v-if='showProfileForm'>
        <form class='profile-form' @submit.prevent>
          <h2 class='heading'>Edit Profile</h2>
          <div class='avatar'></div>
          <div>
            <label>Name</label>
            <IconInput icon='user' placeholder='Name' v-model='name' />
          </div>
          <div>
            <label>Email</label>
            <IconInput icon='mail' placeholder='Email' v-model='email' />
          </div>
          <SolidButton @click='updateProfile'>Save Changes</SolidButton>
          <AccentButton @click='showProfileForm = false'>Cancel</AccentButton>
          <a class='delete-account' @click='showDeletePrompt = true; showProfileForm = false;'>Delete Account</a>
        </form>
      </div>

      <div class='prompt delete-confirmation' v-if='showDeletePrompt'>
        <form @submit.prevent>
          <h2 class='heading'>Delete Account</h2>
          <p class='warning'>All data associated with your account will be permanently deleted! Please confirm your email address if you wish to proceed.</p>
          <div>
            <label>Confirm Email</label>
            <IconInput icon='mail' placeholder='Confirm email address' autocomplete='off' v-model='emailConfirmation' />
          </div>
          <OutlineButton @click='deleteAccount'>Delete Account</OutlineButton>
          <SolidButton @click='showDeletePrompt = false'>Cancel</SolidButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import store from '../store'
import Navbar from '../components/Navbar.vue'
import Preview from '../components/Preview.vue'

const router = useRouter()
const stories = ref([])
const menuState = ref(-1)
const showProfileForm = ref(false)
const showDeletePrompt = ref(false)
const email = ref(store.session.user.email)
const name = ref(store.profile.full_name)
const emailConfirmation = ref('')

async function getOwnStories() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id,
        profile (id, username, avatar_url, full_name),
        media_url
      `)
      .eq('profile', store.profile.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    stories.value = data;
  } catch (error) {
    console.error(error)
  }
}

async function deleteStory (id) {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id)

    if (error) throw error

    getOwnStories()
  } catch (error) {
    console.error(error)
  }
}

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

  showProfileForm.value = false
}

async function deleteAccount () {
  if (emailConfirmation.value != store.session.user.email) {
    return
  }

  try {
    const { error } = await supabase
      .rpc('delete_user')

    if (error) throw error

    router.push('/')
  } catch (error) {
    console.error(error)
  }
}

onMounted(getOwnStories)
</script>

<style scoped lang='scss'>
@import '../assets/themes';

$element-height: calc(1.1em + 15px);

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.account-info {
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  gap: 15px;
  width: max-content;
  padding: 0 15px 15px;
  margin: 0 auto;

  .avatar {
    display: block;
    width: $element-height;
    height: $element-height;
    background: $color-bg-2;
    border-radius: 100%;
  }

  .name {
    margin: auto 0;
  }

  .edit-profile {
    height: $element-height;
    padding: 0 15px;
    border-radius: 100px;
  }

  .friends {
    display: flex;
    gap: 5px;
    width: max-content;
    height: $element-height; 
    background: transparent;
    padding: 0;

    & > * {
      margin: auto 0;
    }
  }

  .logout {
    height: $element-height;
    border-radius: 100px;
    padding: 0 15px;
  }
}

.stories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: max-content;
  padding: 15px;
  margin: 0 auto;

  .preview {
    position: relative;
    cursor: pointer;
    
    &:hover {
      .options {
        visibility: visible;
      }
    }

    .options {
      display: grid;
      gap: 10px;
      position: absolute;
      top: 10px;
      right: 10px;
      visibility: hidden;

      .menu-toggle {
        border-radius: 100px;
        margin: 0 0 0 auto;
      }
    }

    .menu {
      border-radius: 10px;
      background: $color-bg-2;
      padding: 5px;
      margin: 0 0 0 auto;

      button {
        display: flex;
        gap: 5px;
        border-radius: 5px;
        padding: 5px;

        span, .feather {
          margin: auto 0;
        }
      }
    }
  }
}


.prompt {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba($color-bg-1, $shade-5);
  backdrop-filter: blur(30px);

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
    background: $color-bg-1;
    border-radius: 15px;
    padding: 15px;
    margin: auto;
  }
}

.account-editor {
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

  .delete-account {
    font-size: 0.8em;
    display: block;
    width: max-content;
    color: $color-text-2;
    margin: 10px auto 0;
    text-align: center;
    cursor: pointer;
  }
}

.delete-confirmation {
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
</style>
