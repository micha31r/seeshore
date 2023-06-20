import { reactive } from 'vue'

export default reactive({
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