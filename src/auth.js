import { supabase } from './supabase'

export async function signInWithGoogle () {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

export async function signOut () {
  const { error } = await supabase.auth.signOut()
}
