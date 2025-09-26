export interface CategoryItem {
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

export const breakfastItems: CategoryItem[] = [
  {
    id: 1,
    name: 'Overnight Oats with Berries',
    image: 'https://images.pexels.com/photos/4828333/pexels-photo-4828333.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 749,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 234,
    time: '5 min prep',
    servings: 4,
    healthBenefits: ['High Fiber', 'Antioxidants', 'Heart Health'],
    category: 'breakfast',
  },
  {
    id: 2,
    name: 'Avocado Toast with Egg',
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 599,
    rating: 4.7,
    reviews: 189,
    time: '10 min',
    servings: 2,
    healthBenefits: ['Healthy Fats', 'Protein', 'Vitamins'],
    category: 'breakfast',
  },
  {
    id: 3,
    name: 'Greek Yogurt Parfait',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 649,
    originalPrice: 849,
    rating: 4.6,
    reviews: 156,
    time: '3 min',
    servings: 2,
    healthBenefits: ['Probiotics', 'Protein', 'Calcium'],
    category: 'breakfast',
  },
];

export const lunchItems: CategoryItem[] = [
  {
    id: 4,
    name: 'Quinoa Power Bowl',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1099,
    rating: 4.9,
    reviews: 312,
    time: '15 min',
    servings: 3,
    healthBenefits: ['Complete Protein', 'Iron', 'Magnesium'],
    category: 'lunch',
  },
  {
    id: 5,
    name: 'Mediterranean Salad',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 267,
    time: '12 min',
    servings: 2,
    healthBenefits: ['Omega-3', 'Vitamin C', 'Antioxidants'],
    category: 'lunch',
  },
  {
    id: 6,
    name: 'Grilled Salmon with Vegetables',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1599,
    rating: 4.9,
    reviews: 198,
    time: '25 min',
    servings: 2,
    healthBenefits: ['Omega-3', 'Protein', 'Vitamin D'],
    category: 'lunch',
  },
];

export const dinnerItems: CategoryItem[] = [
  {
    id: 7,
    name: 'Herb-Crusted Chicken with Sweet Potato',
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1449,
    rating: 4.7,
    reviews: 223,
    time: '35 min',
    servings: 3,
    healthBenefits: ['Lean Protein', 'Beta-Carotene', 'B-Vitamins'],
    category: 'dinner',
  },
  {
    id: 8,
    name: 'Vegetarian Stir-Fry with Tofu',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 999,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 176,
    time: '20 min',
    servings: 4,
    healthBenefits: ['Plant Protein', 'Fiber', 'Vitamins'],
    category: 'dinner',
  },
  {
    id: 9,
    name: 'Beef and Broccoli Bowl',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1299,
    rating: 4.8,
    reviews: 289,
    time: '30 min',
    servings: 3,
    healthBenefits: ['Iron', 'Protein', 'Vitamin K'],
    category: 'dinner',
  },
];

export const snackItems: CategoryItem[] = [
  {
    id: 10,
    name: 'Mixed Nut & Berry Trail Mix',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 849,
    rating: 4.5,
    reviews: 145,
    time: '0 min',
    servings: 8,
    healthBenefits: ['Healthy Fats', 'Protein', 'Energy'],
    category: 'snacks',
  },
  {
    id: 11,
    name: 'Hummus with Veggie Sticks',
    image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 499,
    originalPrice: 699,
    rating: 4.4,
    reviews: 98,
    time: '2 min',
    servings: 4,
    healthBenefits: ['Fiber', 'Protein', 'Vitamins'],
    category: 'snacks',
  },
  {
    id: 12,
    name: 'Apple Slices with Almond Butter',
    image: 'https://images.pexels.com/photos/1448721/pexels-photo-1448721.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 429,
    rating: 4.7,
    reviews: 167,
    time: '1 min',
    servings: 2,
    healthBenefits: ['Fiber', 'Healthy Fats', 'Natural Sugar'],
    category: 'snacks',
  },
];