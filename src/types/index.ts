export interface Product {
  id: number;
  name: string;
  image: string;
  price: number; // Price in INR
  originalPrice?: number;
  rating: number;
  reviews: number;
  time: string;
  servings: number;
  healthBenefits: string[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SearchResult {
  id: string;
  name: string;
  image: string;
  lowestPrice: number; // Actual lowest price found
  ourPrice: number; // 10% markup price
  source: string;
  rating: number;
  reviews: number;
}