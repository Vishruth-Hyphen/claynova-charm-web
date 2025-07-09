import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Footer } from '../components/Footer';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

// Import all keychain images
import keychain1 from '../assets/keychain-1.jpg';
import keychain2 from '../assets/keychain-2.jpg';
import keychain3 from '../assets/keychain-3.jpg';
import keychain4 from '../assets/keychain-4.jpg';
import keychain5 from '../assets/keychain-5.jpg';
import keychain6 from '../assets/keychain-6.jpg';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Floral Delight',
    price: 499,
    image: keychain1,
    description: 'Beautiful lilac keychain with handcrafted white flowers and gold accents',
    category: 'floral',
  },
  {
    id: '2',
    name: 'Personalized Initial A',
    price: 549,
    image: keychain2,
    description: 'Sky blue keychain with your custom initial and pearl details',
    category: 'personalized',
  },
  {
    id: '3',
    name: 'Geometric Charm',
    price: 479,
    image: keychain3,
    description: 'Beige keychain with minimal geometric patterns and dried flowers',
    category: 'geometric',
  },
  {
    id: '4',
    name: 'Blossom Beauty',
    price: 525,
    image: keychain4,
    description: 'Soft pink keychain with delicate cherry blossom pattern',
    category: 'floral',
  },
  {
    id: '5',
    name: 'Personalized Initial M',
    price: 549,
    image: keychain5,
    description: 'Mint green keychain with custom initial and minimal dot pattern',
    category: 'personalized',
  },
  {
    id: '6',
    name: 'Lavender Dreams',
    price: 495,
    image: keychain6,
    description: 'Soft lavender keychain with small flowers and elegant design',
    category: 'floral',
  },
];

export const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under500' | 'over500'>('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'floral', name: 'Floral' },
    { id: 'personalized', name: 'Personalized' },
    { id: 'geometric', name: 'Geometric' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under500' && product.price < 500) ||
                        (priceRange === 'over500' && product.price >= 500);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover unique handcrafted polymer clay keychains, each one lovingly made just for you
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search keychains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lilac focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lilac"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as 'all' | 'under500' | 'over500')}
                className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lilac"
              >
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="over500">₹500 & Above</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-foreground mb-4">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
      
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};