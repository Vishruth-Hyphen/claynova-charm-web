import { supabase } from '../lib/supabase'

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