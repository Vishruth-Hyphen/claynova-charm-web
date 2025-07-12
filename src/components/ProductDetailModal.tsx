import { useState } from 'react';
import { X, MessageCircle, Palette, Type, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    isCustomizable?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [customization, setCustomization] = useState({
    initial: '',
    colorTheme: 'default',
    hasCustomization: false,
  });

  const colorThemes = [
    { id: 'default', name: 'Original', color: '#a855f7' },
    { id: 'pink', name: 'Pink Blush', color: '#ec4899' },
    { id: 'blue', name: 'Sky Blue', color: '#3b82f6' },
    { id: 'green', name: 'Mint Green', color: '#10b981' },
    { id: 'orange', name: 'Peach', color: '#f97316' },
  ];

  const handleBuyNow = () => {
    const customText = product.isCustomizable && customization.hasCustomization
      ? `\n\nCustomization:\n- Initial: ${customization.initial || 'None'}\n- Color Theme: ${colorThemes.find(t => t.id === customization.colorTheme)?.name || 'Original'}`
      : '';
    
    const message = `Hi! I'm interested in buying the "${product.name}" keychain (₹${product.price}).${customText}`;
    
    const whatsappUrl = `https://wa.me/+919980221242?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-hover">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            <div className="w-full max-w-md mx-auto aspect-[2/3] bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-lilac">₹{product.price}</span>
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through">₹{product.price + 100}</span>
                <div className="text-sm text-green-600 font-medium">Save ₹100</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Customization Options - Only show if product is customizable */}
          {product.isCustomizable && (
            <div className="mb-6 p-4 bg-gradient-accent rounded-xl">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-lilac" />
                <h3 className="font-semibold text-foreground">Customize Your Keychain</h3>
              </div>
            
            <div className="space-y-4">
              {/* Toggle Customization */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="customization"
                  checked={customization.hasCustomization}
                  onChange={(e) => setCustomization(prev => ({ ...prev, hasCustomization: e.target.checked }))}
                  className="w-4 h-4 text-lilac border-gray-300 rounded focus:ring-lilac"
                />
                <label htmlFor="customization" className="text-foreground">
                  Add customization (+₹50)
                </label>
              </div>

              {customization.hasCustomization && (
                <>
                  {/* Initial Input */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-2">
                      <Type className="w-4 h-4" />
                      <span>Add Initial Letter</span>
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={customization.initial}
                      onChange={(e) => setCustomization(prev => ({ ...prev, initial: e.target.value.toUpperCase() }))}
                      placeholder="Enter letter"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lilac"
                    />
                  </div>

                  {/* Color Theme */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setCustomization(prev => ({ ...prev, colorTheme: theme.id }))}
                          className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                            customization.colorTheme === theme.id
                              ? 'border-lilac bg-lilac/10'
                              : 'border-border hover:border-lilac/50'
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span className="text-xs text-foreground">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            </div>
          )}

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="w-full bg-lilac hover:bg-lilac-dark text-white py-4 rounded-full font-medium transition-all duration-300 hover:shadow-hover flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>
              Buy Now - ₹{product.price + (product.isCustomizable && customization.hasCustomization ? 50 : 0)}
            </span>
          </button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Click to continue with WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};