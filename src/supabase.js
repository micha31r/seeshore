import { createClient } from '@supabase/supabase-js'
import store from './store'

// Credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Download private resources
export async function download (bucket, path) {
  let blob

  // Load from store
  if (bucket in store.downloads && path in store.downloads[bucket]) {
    return store.downloads[bucket][path]
  }

  // Download from remote
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(path)

    if (error) throw error

    blob = URL.createObjectURL(data)

    if (!(bucket in store.downloads)) {
      store.downloads[bucket] = {}
    }

    if (!(path in store.downloads[bucket])) {
      store.downloads[bucket][path] = blob
    }

    console.log(blob)

    return blob
  } catch (error) {
    console.error(error)
  }
}
