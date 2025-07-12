// Migration script to populate Supabase with existing product data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Your existing product data (copy from products.ts)
// Note: Removed 'id' field to let Supabase auto-generate UUIDs
// Added priority field - lower values appear first
const productsData = [
  {
    name: 'Personalized Initial',
    price: 499,
    original_price: 599,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-1.jpg',
    description: 'Personalized initial keychain with your custom initial and color theme',
    category: 'personalized',
    is_featured: true,
    is_customizable: true,
    priority: 1,
  },
  {
    name: 'Kawaii Tea Cup',
    price: 549,
    original_price: 649,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-2.jpg',
    description: 'Adorable white tea cup keychain with green leaves and a charming kawaii face',
    category: 'kawaii',
    is_featured: true,
    is_customizable: false,
    priority: 2,
  },
  {
    name: 'Pink Axolotl Keychain',
    price: 479,
    original_price: 579,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-3.jpg',
    description: 'Handmade pink axolotl keychain with flower, perfect for bags, keys, or cute gifting.',
    category: 'kawaii',
    is_featured: true,
    is_customizable: false,
    priority: 3,
  },
  {
    name: 'Bubbletide Octo Buddy',
    price: 525,
    original_price: 625,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-4.jpg',
    description: 'Carries the quiet joy of sea creatures—curious, gentle, always ready to follow you home.',
    category: 'sea',
    is_featured: true,
    is_customizable: false,
    priority: 4,
  },
  {
    name: 'Snowday Stroll',
    price: 549,
    original_price: 649,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-5.jpg',
    description: 'Brings the warmth of winter mornings—bundled up, soft-footed, and quietly waiting by your side.',
    category: 'winter',
    is_featured: false,
    is_customizable: false,
    priority: 5,
  },
  {
    name: 'Morning Bunny',
    price: 495,
    original_price: 595,
    image_url: 'https://jebsscohzmefniontlqd.supabase.co/storage/v1/object/public/product-images/keychain-6.jpg',
    description: 'Brings the warmth of winter mornings—bundled up, soft-footed, and quietly waiting by your side.',
    category: 'winter',
    is_featured: false,
    is_customizable: false,
    priority: 6,
  },
];

async function migrateProducts() {
  console.log('Starting product migration...');
  
  try {
    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(productsData)
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      return;
    }

    console.log('Successfully migrated products:', data);
    console.log(`Migrated ${data.length} products`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateProducts(); 