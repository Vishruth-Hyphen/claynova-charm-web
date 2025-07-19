# Product Visibility Migration

This migration adds an `is_visible` column to the products table to control which products appear on the shop page.

## What's Changed

1. **Database Schema**: Added `is_visible` BOOLEAN column with default value `true`
2. **TypeScript Interfaces**: Updated Product interface and Database types
3. **Product Service**: All product queries now filter by `is_visible = true`
4. **Shop Page**: Only visible products are fetched and displayed

## Migration Steps

### Option 1: SQL Migration (Recommended)

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Run the SQL from `add-is-visible-migration.sql`:

```sql
-- Add the is_visible column with default value true
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Update existing products to be visible by default
UPDATE products 
SET is_visible = true 
WHERE is_visible IS NULL;
```

### Option 2: Node.js Script

1. Ensure you have the required environment variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Run the migration script:
```bash
node scripts/add-is-visible-column.js
```

## How It Works

### Database Level Filtering
- `getAllProducts()` - Only returns products where `is_visible = true`
- `getFeaturedProducts()` - Only returns featured products where `is_visible = true`
- `getProductsByCategory()` - Only returns products in category where `is_visible = true`

### Admin Control
To hide/show products, update the `is_visible` field in the database:

```sql
-- Hide a product
UPDATE products SET is_visible = false WHERE id = 'product-id';

-- Show a product
UPDATE products SET is_visible = true WHERE id = 'product-id';
```

### Product Interface
The Product interface now includes:
```typescript
interface Product {
  // ... existing fields
  isVisible: boolean;
}
```

## Benefits

1. **Performance**: Filtering happens at database level, not in frontend
2. **Consistency**: Hidden products are excluded from all product queries
3. **Admin Control**: Easy to hide/show products without deleting them
4. **Default Behavior**: All existing products remain visible by default

## Rollback

If you need to rollback this migration:

```sql
-- Remove the column (this will permanently delete the visibility data)
ALTER TABLE products DROP COLUMN IF EXISTS is_visible;
```

Note: This will permanently delete the visibility settings. Consider backing up the data first if needed. 