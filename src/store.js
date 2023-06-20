import { reactive } from 'vue'

export default reactive({
  isLoaded: false,
  session: null,
  profile: {
    username: '',
    id: ''
  },
  editor: {
    file: null,
    type: '',
    previewURL: '',
  }
})