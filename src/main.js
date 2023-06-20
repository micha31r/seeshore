import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Protect from './components/Protect.vue'
import Icon from './components/Icon.vue'
import IconInput from './components/IconInput.vue'
import RadioInput from './components/RadioInput.vue'
import AccentButton from './components/AccentButton.vue'
import OutlineButton from './components/OutlineButton.vue'
import SolidButton from './components/SolidButton.vue'

const app = createApp(App)

app
  .use(router)
  .component('Protect', Protect)
  .component('Icon', Icon)
  .component('IconInput', IconInput)
  .component('RadioInput', RadioInput)
  .component('AccentButton', AccentButton)
  .component('OutlineButton', OutlineButton)
  .component('SolidButton', SolidButton)
  .mount('#app')
