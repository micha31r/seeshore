import { supabase } from './supabase'
import store, { storeCache } from './store'

export async function getFollowers () {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('profile', store.profile.id)
        .order('id', { ascending: false })

      if (error) throw error

      return data.map(item => item.follower)
    } catch (error) {
      console.error(error)
    }
  }, 'followers')
}

export async function getFollowing () {
  return await storeCache (async () => {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          profile (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('follower', store.profile.id)
        .order('id', { ascending: false })

      if (error) throw error

      return data.map(item => item.profile)
    } catch (error) {
      console.error(error)
    }
  }, 'following')
}