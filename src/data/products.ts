// Import all keychain images
import keychain1 from '../assets/keychain-1.jpg';
import keychain2 from '../assets/keychain-2.jpg';
import keychain3 from '../assets/keychain-3.jpg';
import keychain4 from '../assets/keychain-4.jpg';
import keychain5 from '../assets/keychain-5.jpg';
import keychain6 from '../assets/keychain-6.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  category: string;
  isFeatured: boolean;
  isCustomizable: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Personalized Initial',
    price: 499,
    originalPrice: 599,
    image: keychain1,
    description: 'Personalized initial keychain with your custom initial and color theme',
    category: 'personalized',
    isFeatured: true,
    isCustomizable: true,
  },
  {
    id: '2',
    name: 'Kawaii Tea Cup',
    price: 549,
    originalPrice: 649,
    image: keychain2,
    description: 'Adorable white tea cup keychain with green leaves and a charming kawaii face',
    category: 'kawaii',
    isFeatured: true,
    isCustomizable: false,
  },
  {
    id: '3',
    name: 'Pink Axolotl Keychain',
    price: 479,
    originalPrice: 579,
    image: keychain3,
    description: 'Handmade pink axolotl keychain with flower, perfect for bags, keys, or cute gifting.',
    category: 'kawaii',
    isFeatured: true,
    isCustomizable: false,
  },
  {
    id: '4',
    name: 'Bubbletide Octo Buddy',
    price: 525,
    originalPrice: 625,
    image: keychain4,
    description: 'Carries the quiet joy of sea creatures—curious, gentle, always ready to follow you home.',
    category: 'sea',
    isFeatured: true,
    isCustomizable: false,
  },
  {
    id: '5',
    name: 'Snowday Stroll',
    price: 549,
    originalPrice: 649,
    image: keychain5,
    description: 'Brings the warmth of winter mornings—bundled up, soft-footed, and quietly waiting by your side.',
    category: 'winter',
    isFeatured: false,
    isCustomizable: false,
  },
  {
    id: '6',
    name: 'Morning Bunny',
    price: 495,
    originalPrice: 595,
    image: keychain6,
    description: 'Brings the warmth of winter mornings—bundled up, soft-footed, and quietly waiting by your side.',
    category: 'winter',
    isFeatured: false,
    isCustomizable: false,
  },
];

// Helper functions
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isFeatured);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
}; 