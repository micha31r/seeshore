import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Icon from './components/Icon.vue'
import IconInput from './components/IconInput.vue'
import RadioInput from './components/RadioInput.vue'
import AccentButton from './components/AccentButton.vue'
import OutlineButton from './components/OutlineButton.vue'
import SolidButton from './components/SolidButton.vue'
import Prompt from './components/Prompt.vue'
import Menu from './components/Menu.vue'

const app = createApp(App)

app
  .use(router)
  .component('Icon', Icon)
  .component('IconInput', IconInput)
  .component('RadioInput', RadioInput)
  .component('AccentButton', AccentButton)
  .component('OutlineButton', OutlineButton)
  .component('SolidButton', SolidButton)
  .component('Prompt', Prompt)
  .component('Menu', Menu)
  .mount('#app')
