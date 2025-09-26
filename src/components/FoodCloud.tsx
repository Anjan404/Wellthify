import React, { useState, useEffect } from 'react';

interface FoodItem {
  id: number;
  name: string;
  emoji: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  x: number;
  y: number;
  animationDelay: number;
  targetCategory?: string;
}

interface FoodCloudProps {
  isAnimating: boolean;
}

const FoodCloud: React.FC<FoodCloudProps> = ({ isAnimating }) => {
  const [foodItems] = useState<FoodItem[]>([
    // Breakfast items
    { id: 1, name: 'Avocado', emoji: '🥑', category: 'breakfast', x: 15, y: 20, animationDelay: 0 },
    { id: 2, name: 'Banana', emoji: '🍌', category: 'breakfast', x: 75, y: 35, animationDelay: 0.2 },
    { id: 3, name: 'Oatmeal', emoji: '🥣', category: 'breakfast', x: 45, y: 15, animationDelay: 0.4 },
    { id: 4, name: 'Eggs', emoji: '🥚', category: 'breakfast', x: 25, y: 45, animationDelay: 0.6 },
    
    // Lunch items
    { id: 5, name: 'Salad', emoji: '🥗', category: 'lunch', x: 85, y: 60, animationDelay: 0.8 },
    { id: 6, name: 'Salmon', emoji: '🍣', category: 'lunch', x: 65, y: 25, animationDelay: 1.0 },
    { id: 7, name: 'Quinoa', emoji: '🌾', category: 'lunch', x: 35, y: 65, animationDelay: 1.2 },
    { id: 8, name: 'Broccoli', emoji: '🥦', category: 'lunch', x: 55, y: 50, animationDelay: 1.4 },
    
    // Dinner items
    { id: 9, name: 'Sweet Potato', emoji: '🍠', category: 'dinner', x: 20, y: 75, animationDelay: 1.6 },
    { id: 10, name: 'Chicken', emoji: '🍗', category: 'dinner', x: 80, y: 15, animationDelay: 1.8 },
    { id: 11, name: 'Asparagus', emoji: '🌱', category: 'dinner', x: 10, y: 55, animationDelay: 2.0 },
    { id: 12, name: 'Brown Rice', emoji: '🍚', category: 'dinner', x: 70, y: 70, animationDelay: 2.2 },
    
    // Snacks
    { id: 13, name: 'Apple', emoji: '🍎', category: 'snacks', x: 60, y: 40, animationDelay: 2.4 },
    { id: 14, name: 'Nuts', emoji: '🥜', category: 'snacks', x: 40, y: 30, animationDelay: 2.6 },
    { id: 15, name: 'Berries', emoji: '🫐', category: 'snacks', x: 90, y: 45, animationDelay: 2.8 },
    { id: 16, name: 'Yogurt', emoji: '🥛', category: 'snacks', x: 30, y: 80, animationDelay: 3.0 },
  ]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {foodItems.map((item) => (
        <div
          key={item.id}
          className={`absolute transition-all duration-1000 ease-out transform ${
            isAnimating 
              ? 'opacity-0 scale-50' 
              : 'opacity-100 scale-100 animate-float'
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.animationDelay}s`,
            transform: isAnimating 
              ? `translate(-50%, -50%) scale(0.5)` 
              : `translate(-50%, -50%) scale(1)`,
          }}
        >
          <div className="text-4xl md:text-6xl filter drop-shadow-lg hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodCloud;