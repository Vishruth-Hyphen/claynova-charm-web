import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  isCustomizable?: boolean;
  onClick?: () => void;
}

export const ProductCard = ({ id, name, price, originalPrice, image, description, onClick }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]" onClick={onClick}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          </div>
        )}
        <img
          src={image}
          alt={name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Heart Icon */}
        <button
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-lilac transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-lilac">₹{price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
          </div>
          
          <button
            className="flex items-center space-x-2 bg-lilac hover:bg-lilac-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-soft"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};