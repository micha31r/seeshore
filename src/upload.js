import Compressor from 'compressorjs'
import { supabase } from './supabase'

function compressAsync(file, options) {
  return new Promise((resolve, reject) => new Compressor(file, {
    ...options,
    success: result => resolve(result),
    error: error => reject(error)
  }))
}

export async function uploadImage(bucket, path, file) {
  const result = await compressAsync(file, {
    quality: 0.4,
    // minWidth: 360,
    // minHeight: 640,
    // maxWidth: 1920,
    // maxHeight: 1080,
    convertTypes: ['image/png', 'image/webp'],
  })

  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, result)

    if (error) throw error

    return data
  } catch (error) {
    console.error(error);
  }
}