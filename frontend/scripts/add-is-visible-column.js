// Migration script to add is_visible column to products table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addIsVisibleColumn() {
  console.log('Adding is_visible column to products table...');
  
  try {
    // First, get all existing products
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id');

    if (fetchError) {
      console.error('Error fetching existing products:', fetchError);
      return;
    }

    console.log(`Found ${existingProducts.length} existing products`);

    // Note: The column should be added via SQL in Supabase dashboard
    // This script will verify the column exists and update products if needed
    
    // Try to update all products to have is_visible = true
    const { error: updateError } = await supabase
      .from('products')
      .update({ is_visible: true })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all products

    if (updateError) {
      console.error('Error updating products visibility:', updateError);
      console.log('Please run the SQL migration first in Supabase dashboard:');
      console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;');
      return;
    }

    console.log('Successfully updated all products to be visible');
    console.log('Migration completed successfully!');
    
    // Verify the migration
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, is_visible')
      .limit(5);

    if (!verifyError && verifyData) {
      console.log('Sample products with visibility status:');
      verifyData.forEach(product => {
        console.log(`- ${product.name}: ${product.is_visible ? 'visible' : 'hidden'}`);
      });
    }

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
addIsVisibleColumn(); 