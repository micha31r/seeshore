<template>
  <div class='container'>
    <h1 class='logo'>Seeshore</h1>
    <button class='login' @click='signInWithGoogle'>Login with Google</button>
  </div>
</template>

<script>
import { signInWithGoogle } from '../auth'

export default {
  name: 'HomeView',
  data () {
    return {
      signInWithGoogle
    }
  }
}
</script>

<style scoped lang='scss'>
  .container {
    display: flex;
    justify-content: center;
  }

  .logo {
    font-family: 'Urbanist', sans-serif;
    font-size: 2.5em;
    margin: auto;
  }

  .login {
    position: fixed;
    bottom: 80px;
    width: 300px;
    max-width: calc(100vw - 40px);
    background: transparent;
    border: 1px solid var(--c-border-primary);
    box-shadow: 0 20px 80px rgba(255,255,255,0.2);
    color: var(--c-text-secondary);
  }
</style>
