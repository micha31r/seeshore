import Compressor from 'compressorjs'
import { supabase } from './supabase'

const compressorDefaultOptions = {
  quality: 0.3,
  minWidth: 400,
  minHeight: 400,
  maxWidth: 2000,
  maxHeight: 2000
}

function compressAsync(file, options) {
  return new Promise((resolve, reject) => new Compressor(file, {
    ...options,
    success: result => resolve(result),
    error: error => reject(error)
  }))
}

export async function uploadImage(bucket, path, file, options) {
  options = { ...compressorDefaultOptions, ...options }

  const result = await compressAsync(file, {
    ...options,
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