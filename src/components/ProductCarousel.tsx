import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

// Import keychain images
import keychain1 from '../assets/keychain-1.jpg';
import keychain2 from '../assets/keychain-2.jpg';
import keychain3 from '../assets/keychain-3.jpg';
import keychain4 from '../assets/keychain-4.jpg';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Floral Delight',
    price: 499,
    image: keychain1,
    description: 'Beautiful lilac keychain with handcrafted white flowers and gold accents',
  },
  {
    id: '2',
    name: 'Personalized Initial',
    price: 549,
    image: keychain2,
    description: 'Sky blue keychain with your custom initial and pearl details',
  },
  {
    id: '3',
    name: 'Geometric Charm',
    price: 479,
    image: keychain3,
    description: 'Beige keychain with minimal geometric patterns and dried flowers',
  },
  {
    id: '4',
    name: 'Blossom Beauty',
    price: 525,
    image: keychain4,
    description: 'Soft pink keychain with delicate cherry blossom pattern',
  },
];

interface ProductCarouselProps {
  onProductClick?: (product: Product) => void;
}

export const ProductCarousel = ({ onProductClick }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % featuredProducts.length;
      products.push(featuredProducts[index]);
    }
    
    return products;
  };

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

          {/* Navigation Buttons */}
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
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-lilac' : 'bg-border hover:bg-accent'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};