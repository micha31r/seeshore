import { reactive } from 'vue'

export default reactive({
  session: null,
  profile: null,
  editor: {
    file: null,
    type: '',
    previewURL: '',
  },
  downloads: {}
})