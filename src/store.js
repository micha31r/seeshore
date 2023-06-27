import { reactive } from 'vue'
import Paginator from './pagination'

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

const cacheDefaultOptions = {
  append: false,
  nextPage: false,
  duration: 3600000,
  pageSize: 20
}

// Cache data for a period of time
// Default cache duration is 1 hour
export async function storeCache (get, key, options) {
  options = { ...cacheDefaultOptions, ...options }

  // Load cached data
  if (!options.append && key in store.cache) {
    const expireDateTime = new Date(Date.now() - options.duration)
    const timestamp = store.cache[key].timestamp

    if (timestamp >= expireDateTime) {
      return store.cache[key].data
    }
  }

  try {
    const entry = store.cache[key]

    // Only appendable if entry already exists and option.append = true
    const isAppendable = options.append && entry

    // Get paginator
    const paginator = isAppendable
      ? entry.paginator
      : new Paginator(options.pageSize)

    if (isAppendable && options.nextPage) {
      // Increase page number
      paginator.next()
    }

    // Get data from remote
    const data = await get(paginator)
    const timestamp = new Date()

    if (isAppendable && data instanceof Array) {
      // Append new data
      entry.data = entry.data.concat(data)
      entry.timestamp = timestamp
    } else {
      // Set new data
      store.cache[key] = {
        data,
        timestamp,
        paginator
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
