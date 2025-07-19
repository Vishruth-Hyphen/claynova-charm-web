import { useQuery } from '@tanstack/react-query'
import { 
  getAllProducts, 
  getFeaturedProducts, 
  getProductsByCategory, 
  getProductById,
  type Product 
} from '../services/productService'

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  })
}

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Get products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Get product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id, // Only run if ID is provided
  })
} 