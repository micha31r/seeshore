<template>
  <Protect>
    <div class='grid'>
      <Navbar pageName='Share' />

      <div class='share'>
        <div class='preview'>
          <div class='image'>
            <AccentButton class='back icon'>
              <Icon icon='arrow-left'/>
            </AccentButton>
          </div>
        </div>

        <div class='contacts'>
          <IconInput icon='search' placeholder='Search'/>

          <div class='recipients'>
            <div class='tag'>
              <div class='avatar'></div>
              <p class='name'>Michael</p>
              <AccentButton class='remove icon'>
                <Icon icon='x' />
              </AccentButton>
            </div>

            <div class='tag'>
              <div class='avatar'></div>
              <p class='name'>Peter Parker</p>
              <AccentButton class='remove icon'>
                <Icon icon='x' />
              </AccentButton>
            </div>

            <div class='tag'>
              <div class='avatar'></div>
              <p class='name'>Jake Sully</p>
              <AccentButton class='remove icon'>
                <Icon icon='x' />
              </AccentButton>
            </div>
          </div>

          <div class='list'>
            <p class='category'>Friends</p>

            <div class='item'>
              <div class='avatar'></div>
              <p class='name'>Gloria</p>
              <div class='radio-input'></div>
            </div>

            <div class='item'>
              <div class='avatar'></div>
              <p class='name'>Cameron</p>
              <div class='radio-input'></div>
            </div>

            <div class='item'>
              <div class='avatar'></div>
              <p class='name'>Phil</p>
              <div class='radio-input'></div>
            </div>

            <p class='category'>Groups</p>

            <div class='item'>
              <div class='avatar'></div>
              <p class='name'>Avatar Fans</p>
              <div class='radio-input'></div>
            </div>
          </div>
        </div>

        <SolidButton class='share'>Share</SolidButton>
      </div>
    </div>
  </Protect>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>

<style scoped lang='scss'>
@import '../assets/themes';

.grid {
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
}

.share {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 15px;

  .preview {
    width: max-content;
    height: max-content;
    margin: 0 auto;

    .image {
      display: flex;
      width: 150px;
      height: 210px;
      border-radius: 15px;
      background: $color-bg-2;
      margin: 0 auto;
    }

    .back {
      border-radius: 100px;
      margin: auto 0 auto calc(-1.1em - 15px - 15px);
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 400px;
    margin: 0 auto;

    .avatar {
      display: block;
      width: 40px;
      height: 40px;
      border: 1px solid $color-border-1;
      border-radius: 100%;
      background: $color-bg-2;
      margin: auto 0;
    }

    .recipients {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .tag {
        display: flex;
        width: max-content;
        gap: 10px;
        border-radius: 10px;
        background: $color-bg-2;
        padding: 7px;

        .avatar {
          width: 25px;
          height: 25px;
        }

        .name {
          color: $color-text-2;
          margin: auto 0;
        }

        .remove {
          width: max-content;
          height: max-content;
          padding: 0;
          border-radius: 100%;
          background: transparent;
          margin: auto 0;
        }
      }
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .category {
        color: $color-text-2;
        margin: 0;
      }

      .item {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 10px;
        border-radius: 10px;
        cursor: pointer;

        .name {
          margin: auto 0;
        }

        .radio-input {
          display: block;
          width: 20px;
          height: 20px;
          border: 2px solid $color-border-1;
          border-radius: 100%;
          margin: auto 0;
        }
      }

      .item::before {
        content: '';
        display: block;
        position: absolute;
        width: calc(100% + 20px);
        height: calc(100% + 20px);
        border-radius: 15px;
        top: -10px;
        left: -10px;
        transition: background 0.2s;
        z-index: -1;
      }

      .item:hover::before {
        background: $color-bg-2;
      }
    }
  }

  .share {
    border-radius: 100px;
    padding: 10px 15px;
    margin: 0 auto;
  }
}
</style>
