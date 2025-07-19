import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { ProductCarousel } from '../components/ProductCarousel';
// import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Product } from '../services/productService';

export const Homepage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <HeroSection />
      <ProductCarousel onProductClick={handleProductClick} />
      {/* <Testimonials /> */}
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