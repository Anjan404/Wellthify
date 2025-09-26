import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../services/searchService';

interface CategoryItem {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  time: string;
  servings: number;
  healthBenefits: string[];
}

interface CategorySectionProps {
  title: string;
  emoji: string;
  items: CategoryItem[];
  bgColor: string;
  accentColor: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  emoji, 
  items, 
  bgColor,
  accentColor 
}) => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`section-${title.toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [title]);

  const handleAddToCart = (item: CategoryItem) => {
    const product = {
      ...item,
      category: item.category || 'lunch' as const
    };
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <section 
      id={`section-${title.toLowerCase()}`}
      className={`py-20 relative overflow-hidden`}
      style={{backgroundColor: '#FAFAFA'}}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306B6D4' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover nutritious options with the best prices and personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-800">Best Price</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-2xl font-bold ${accentColor.replace('bg-', 'text-')}`}>
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                    <span>({item.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{item.servings} servings</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Health Benefits:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.healthBenefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToCart(item)}
                  className={`w-full ${accentColor} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;