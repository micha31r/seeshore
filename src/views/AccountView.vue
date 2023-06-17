<template>
  <Protect>
    <div class='grid'>
      <Navbar pageName='Profile' />

      <div class='account'>
        <div class='account-info'>
          <div class='avatar'></div>
          <p class='name'>Michael</p>
          <AccentButton class='edit-profile'>Edit</AccentButton>
          <AccentButton class='friends'>
            <Icon icon='users'/>
            <span>37</span>
          </AccentButton>
          <OutlineButton class='logout'>Logout</OutlineButton>
        </div>

        <div class='gallery'>
          <div class='item' v-for='_ in story.chapters'></div>
        </div>
      </div>
    </div>
  </Protect>
</template>

<script setup>
import { ref } from 'vue'
// import store from '../store'
import Navbar from '../components/Navbar.vue'

const story = ref({
    name: 'Michael',
    chapters: [{}, {}, {}, {}]
})
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

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: max-content;
  padding: 15px;
  margin: 0 auto;

  .item {
    display: block;
    width: 400px;
    height: 560px;
    border-radius: 15px;
    background: $color-bg-2;
  }
}

</style>
