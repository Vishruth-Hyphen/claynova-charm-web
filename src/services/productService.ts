import { supabase } from '../lib/supabase'
import { uploadProductImage, deleteProductImage, ImageUploadResult } from './imageUploadService'
import { generateProductContentWithFallback, AIGeneratedContent } from './aiService'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  description: string
  category: string
  isFeatured: boolean
  isCustomizable: boolean
  isVisible: boolean
  priority?: number | null
  createdAt?: string
  updatedAt?: string
}

// Transform database row to frontend interface
const transformProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: row.price,
  originalPrice: row.original_price,
  image: row.image_url,
  description: row.description,
  category: row.category,
  isFeatured: row.is_featured,
  isCustomizable: row.is_customizable,
  isVisible: row.is_visible,
  priority: row.priority,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

// Get all products (only visible ones)
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)
    .order('priority', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return data.map(transformProduct)
}

// Get all products including hidden ones (admin only)
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('priority', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return data.map(transformProduct)
}

// Get featured products (only visible ones)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_visible', true)
    .order('priority', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured products:', error)
    throw new Error('Failed to fetch featured products')
  }

  return data.map(transformProduct)
}

// Get products by category (only visible ones)
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  query = query
    .order('priority', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }

  return data.map(transformProduct)
}

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Product not found
    }
    console.error('Error fetching product by ID:', error)
    throw new Error('Failed to fetch product')
  }

  return transformProduct(data)
}

// Create new product (admin only)
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      price: product.price,
      original_price: product.originalPrice,
      image_url: product.image,
      description: product.description,
      category: product.category,
      is_featured: product.isFeatured,
      is_customizable: product.isCustomizable,
      is_visible: product.isVisible,
      priority: product.priority,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }

  return transformProduct(data)
}

// Update product (admin only)
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const updateData: any = {}
  
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.price !== undefined) updateData.price = updates.price
  if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice
  if (updates.image !== undefined) updateData.image_url = updates.image
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured
  if (updates.isCustomizable !== undefined) updateData.is_customizable = updates.isCustomizable
  if (updates.isVisible !== undefined) updateData.is_visible = updates.isVisible
  if (updates.priority !== undefined) updateData.priority = updates.priority

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw new Error('Failed to update product')
  }

  return transformProduct(data)
}

// Delete product (admin only)
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }
}

// Enhanced product creation with image upload and AI generation
export interface CreateProductWithImageData {
  imageFile: File
  price: number
  originalPrice: number
  priority?: number
  isVisible: boolean
  isFeatured: boolean
  isCustomizable?: boolean
  // Optional manual overrides
  manualTitle?: string
  manualDescription?: string
  manualCategory?: string
}

export interface CreateProductResult {
  product?: Product
  success: boolean
  error?: string
  imageUploadResult?: ImageUploadResult
  aiResult?: AIGeneratedContent
}

export const createProductWithImage = async (
  data: CreateProductWithImageData
): Promise<CreateProductResult> => {
  try {
    // Step 1: Upload image
    const imageUploadResult = await uploadProductImage(data.imageFile)
    
    if (!imageUploadResult.success) {
      return {
        success: false,
        error: imageUploadResult.error || 'Failed to upload image',
        imageUploadResult
      }
    }

    // Step 2: Generate AI content (if manual overrides not provided)
    let aiResult: AIGeneratedContent | undefined
    let title = data.manualTitle || ''
    let description = data.manualDescription || ''
    let category = data.manualCategory || 'kawaii'

    if (!data.manualTitle || !data.manualDescription || !data.manualCategory) {
      aiResult = await generateProductContentWithFallback(
        data.imageFile,
        data.price,
        data.originalPrice
      )

      if (aiResult.success) {
        title = data.manualTitle || aiResult.title
        description = data.manualDescription || aiResult.description
        category = data.manualCategory || aiResult.category
      } else {
        // If AI fails and no manual content provided, use fallbacks
        title = data.manualTitle || 'Handcrafted Keychain'
        description = data.manualDescription || 'Beautiful handcrafted clay keychain made with love.'
        category = data.manualCategory || 'kawaii'
      }
    }

    // Step 3: Create product in database
    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: title,
      price: data.price,
      originalPrice: data.originalPrice,
      image: imageUploadResult.url,
      description: description,
      category: category,
      isFeatured: data.isFeatured,
      isCustomizable: data.isCustomizable || false,
      isVisible: data.isVisible,
      priority: data.priority || null
    }

    const product = await createProduct(productData)

    return {
      product,
      success: true,
      imageUploadResult,
      aiResult
    }
  } catch (error) {
    console.error('Error in createProductWithImage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

// Enhanced product update with optional image replacement
export interface UpdateProductWithImageData {
  id: string
  imageFile?: File // Optional: only if replacing image
  price?: number
  originalPrice?: number
  priority?: number
  isVisible?: boolean
  isFeatured?: boolean
  isCustomizable?: boolean
  name?: string
  description?: string
  category?: string
  // AI regeneration options
  regenerateWithAI?: boolean
}

export const updateProductWithImage = async (
  data: UpdateProductWithImageData
): Promise<CreateProductResult> => {
  try {
    let imageUploadResult: ImageUploadResult | undefined
    let aiResult: AIGeneratedContent | undefined
    let updates: Partial<Product> = {}

    // Get current product data
    const currentProduct = await getProductById(data.id)
    if (!currentProduct) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    // Step 1: Handle image upload if new image provided
    if (data.imageFile) {
      imageUploadResult = await uploadProductImage(data.imageFile)
      
      if (!imageUploadResult.success) {
        return {
          success: false,
          error: imageUploadResult.error || 'Failed to upload image',
          imageUploadResult
        }
      }

      updates.image = imageUploadResult.url

      // Delete old image if it exists and is different
      if (currentProduct.image && currentProduct.image !== imageUploadResult.url) {
        // Extract path from URL for deletion
        const urlParts = currentProduct.image.split('/product-images/')
        if (urlParts.length > 1) {
          const imagePath = 'products/' + urlParts[1].split('?')[0]
          await deleteProductImage(imagePath)
        }
      }
    }

    // Step 2: Handle AI regeneration if requested
    if (data.regenerateWithAI && (data.imageFile || currentProduct.image)) {
      const fileToAnalyze = data.imageFile
      
      if (fileToAnalyze) {
        aiResult = await generateProductContentWithFallback(
          fileToAnalyze,
          data.price || currentProduct.price,
          data.originalPrice || currentProduct.originalPrice
        )

        if (aiResult.success) {
          if (!data.name) updates.name = aiResult.title
          if (!data.description) updates.description = aiResult.description
          if (!data.category) updates.category = aiResult.category
        }
      }
    }

    // Step 3: Apply manual updates
    if (data.price !== undefined) updates.price = data.price
    if (data.originalPrice !== undefined) updates.originalPrice = data.originalPrice
    if (data.priority !== undefined) updates.priority = data.priority
    if (data.isVisible !== undefined) updates.isVisible = data.isVisible
    if (data.isFeatured !== undefined) updates.isFeatured = data.isFeatured
    if (data.isCustomizable !== undefined) updates.isCustomizable = data.isCustomizable
    if (data.name !== undefined) updates.name = data.name
    if (data.description !== undefined) updates.description = data.description
    if (data.category !== undefined) updates.category = data.category

    // Step 4: Update product in database
    const product = await updateProduct(data.id, updates)

    return {
      product,
      success: true,
      imageUploadResult,
      aiResult
    }
  } catch (error) {
    console.error('Error in updateProductWithImage:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

// Get all categories used in products
export const getProductCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_visible', true)

  if (error) {
    console.error('Error fetching categories:', error)
    return ['personalized', 'kawaii', 'sea', 'winter'] // Default categories
  }

  const categories = [...new Set(data.map(item => item.category))]
  return categories.length > 0 ? categories : ['personalized', 'kawaii', 'sea', 'winter']
}