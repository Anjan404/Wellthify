import { SearchResult } from '../types';
import { fetchRealTimeProductPrices } from './deepseekService';

// Enhanced search service with real-time pricing using DeepSeek AI
export const searchProducts = async (query: string): Promise<SearchResult[]> => {
  try {
    // Get real-time pricing data from DeepSeek AI
    const priceData = await fetchRealTimeProductPrices(query);
    
    // Convert to SearchResult format
    const results: SearchResult[] = priceData.prices.map((price, index) => ({
      id: `search-${Date.now()}-${index}`,
      name: priceData.name,
      image: getProductImage(query, index),
      lowestPrice: priceData.lowestPrice,
      ourPrice: Math.ceil(price.price * 1.1), // 10% markup
      source: price.store,
      rating: price.rating,
      reviews: Math.floor(Math.random() * 1000) + 50
    }));

    return results;
  } catch (error) {
    console.error('Error in searchProducts:', error);
    
    // Fallback to enhanced mock data
    const mockResults: SearchResult[] = [
      {
        id: `search-${Date.now()}-1`,
        name: `Organic ${query}`,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        lowestPrice: Math.floor(Math.random() * 500) + 100,
        ourPrice: 0,
        source: 'Amazon India',
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 1000) + 50
      },
      {
        id: `search-${Date.now()}-2`,
        name: `Premium ${query}`,
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
        lowestPrice: Math.floor(Math.random() * 400) + 150,
        ourPrice: 0,
        source: 'Flipkart',
        rating: 4.2 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 800) + 30
      },
      {
        id: `search-${Date.now()}-3`,
        name: `Fresh ${query}`,
        image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
        lowestPrice: Math.floor(Math.random() * 300) + 80,
        ourPrice: 0,
        source: 'BigBasket',
        rating: 4.0 + Math.random() * 1.0,
        reviews: Math.floor(Math.random() * 500) + 20
      }
    ];

    // Add 10% markup to create our price
    return mockResults.map(result => ({
      ...result,
      ourPrice: Math.ceil(result.lowestPrice * 1.1)
    }));
  }
};

// Helper function to get appropriate product images
const getProductImage = (query: string, index: number): string => {
  const images = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];
  return images[index % images.length];
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};