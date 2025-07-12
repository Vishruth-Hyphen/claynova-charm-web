import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import { Product } from '../services/productService';

interface ProductCarouselProps {
  onProductClick?: (product: Product) => void;
}

export const ProductCarousel = ({ onProductClick }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: featuredProducts = [], isLoading, error } = useFeaturedProducts();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const getVisibleProducts = () => {
    const visibleCount = typeof window !== 'undefined' 
      ? window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
      : 1;
    const products = [];
    
    for (let i = 0; i < visibleCount && i < featuredProducts.length; i++) {
      const index = (currentIndex + i) % featuredProducts.length;
      products.push(featuredProducts[index]);
    }
    
    return products;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Creations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved handcrafted keychains, each one unique and made with care
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Creations
            </h2>
            <p className="text-lg text-red-500">
              Failed to load featured products. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Creations
            </h2>
            <p className="text-lg text-muted-foreground">
              No featured products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Creations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved handcrafted keychains, each one unique and made with care
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisibleProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => onProductClick?.(product)}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Only show if more than 3 products */}
          {featuredProducts.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-accent rounded-full p-3 shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-accent rounded-full p-3 shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {featuredProducts.length > 3 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(0, featuredProducts.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-lilac' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};