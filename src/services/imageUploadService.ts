import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export interface ImageUploadResult {
  url: string
  path: string
  success: boolean
  error?: string
}

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadProductImage = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        url: '',
        path: '',
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        url: '',
        path: '',
        success: false,
        error: 'File size too large. Please upload an image smaller than 5MB.'
      }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = `products/${fileName}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return {
        url: '',
        path: '',
        success: false,
        error: `Upload failed: ${error.message}`
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
      success: true
    }
  } catch (error) {
    console.error('Error in uploadProductImage:', error)
    return {
      url: '',
      path: '',
      success: false,
      error: 'An unexpected error occurred during upload.'
    }
  }
}

// Delete image from storage
export const deleteProductImage = async (imagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([imagePath])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteProductImage:', error)
    return false
  }
}

// Get image URL from path
export const getImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath)
  
  return data.publicUrl
}

// Validate image file before upload
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size too large. Please upload an image smaller than 5MB.'
    }
  }

  return { valid: true }
} 