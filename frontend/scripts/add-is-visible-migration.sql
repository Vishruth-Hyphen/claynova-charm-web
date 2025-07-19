-- Migration: Add is_visible column to products table
-- Run this in the Supabase SQL Editor

-- Add the is_visible column with default value true
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Update existing products to be visible by default
UPDATE products 
SET is_visible = true 
WHERE is_visible IS NULL;

-- Add a comment to the column
COMMENT ON COLUMN products.is_visible IS 'Controls whether the product is visible on the shop page';

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name = 'is_visible';

-- Show current products with visibility status
SELECT id, name, is_visible FROM products ORDER BY priority, created_at; 