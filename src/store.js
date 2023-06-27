import { reactive } from 'vue'

const store = reactive({
  session: null,
  profile: null,
  theme: 'light',

  // For creating new stories
  editor: {
    file: null,
    type: '',
    previewURL: '',
  },

  // Caching
  downloads: {}, // media data
  cache: {} // other data
})

export default store

// Cache data for a period of time
// Default cache duration is 1 hour
export async function storeCache (get, key, append = false, duration = 3600000) {
  // Load cached data
  if (!append && key in store.cache) {
    const expireDateTime = new Date(Date.now() - duration)
    const timestamp = store.cache[key].timestamp

    if (timestamp >= expireDateTime) {
      return store.cache[key].data
    }
  }

  // Get data from remote
  try {
    const data = await get()
    const timestamp = new Date()
    const entry = store.cache[key]

    if (append && entry && data instanceof Array) {
      // Append new data
      entry.data = entry.data.concat(data)
      entry.timestamp = timestamp
    } else {
      // Set new data
      store.cache[key] = {
        data,
        timestamp
      }
    }

    return data
  } catch (error) {
    console.error(error)
  }
}

// Force items to expire (to fetch new data)
export function forceExpire (key = null) {
  Object.entries(store.cache).some(([name, item]) => {
    if ((key instanceof String)) {
      if (key == name) {
        item.timestamp = null
        return true
      }
    } else {
      item.timestamp = null
    }
  })
}
