import { supabase } from './supabase'
import store, { storeCache } from './store'

export async function getFollowers (filter = '%', options = {}) {
  options = { name: 'followers', ...options }

  return await storeCache (async (paginator) => {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower!inner (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('profile', store.profile.id)
        .ilike('follower.full_name', filter)
        .order('id', { ascending: false })
        .range(...paginator.getRange())

      if (error) throw error

      return data.map(item => item.follower)
    } catch (error) {
      console.error(error)
    }
  }, options)
}

export async function getFollowing (filter = '%', options = { name: 'following' }) {
  options = { name: 'following', ...options }

  return await storeCache (async (paginator) => {
    try {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          profile!inner (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('follower', store.profile.id)
        .ilike('profile.full_name', filter)
        .order('id', { ascending: false })
        .range(...paginator.getRange())

      if (error) throw error

      return data.map(item => item.profile)
    } catch (error) {
      console.error(error)
    }
  }, options)
}

export async function getFollowerCount (options = { name: 'followerCount' }) {
  return await storeCache (async () => {
    try {
      const { count, error } = await supabase
        .from('followers')
        .select(`id`, { count: 'exact', head: true })
        .eq('profile', store.profile.id)

      if (error) throw error

      return count
    } catch (error) {
      console.error(error)
    }
  }, options)
}

export async function getFollowingCount (options = { name: 'followingCount' }) {
  return await storeCache (async () => {
    try {
      const { count, error } = await supabase
        .from('followers')
        .select(`id`, { count: 'exact', head: true })
        .eq('follower', store.profile.id)

      if (error) throw error

      return count
    } catch (error) {
      console.error(error)
    }
  }, options)
}
