import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number
          image_url: string
          description: string
          category: string
          is_featured: boolean
          is_customizable: boolean
          priority: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price: number
          image_url: string
          description: string
          category: string
          is_featured?: boolean
          is_customizable?: boolean
          priority?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number
          image_url?: string
          description?: string
          category?: string
          is_featured?: boolean
          is_customizable?: boolean
          priority?: number | null
          updated_at?: string
        }
      }
    }
  }
} 