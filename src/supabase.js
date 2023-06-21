import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function download (bucket, path) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(path)

    if (error) throw error

    return URL.createObjectURL(data)
  } catch (error) {
    console.error(error)
  }
}
