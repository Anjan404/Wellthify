import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, Award, Clock, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../services/searchService';

const PriceComparison: React.FC = () => {
  const navigate = useNavigate();

  const deals = [
    {
      id: 1,
      name: 'Organic Quinoa (2 lbs)',
      image: 'https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=400',
      bestPrice: 1099,
      avgPrice: 1599,
      savings: '30%',
      store: 'Whole Foods',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Wild Alaskan Salmon (1 lb)',
      image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
      bestPrice: 2099,
      avgPrice: 2699,
      savings: '22%',
      store: 'Costco',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Organic Avocados (6 pack)',
      image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400',
      bestPrice: 749,
      avgPrice: 1049,
      savings: '28%',
      store: 'Trader Joe\'s',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Premium Protein Powder (2 lbs)',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=400',
      bestPrice: 3399,
      avgPrice: 4699,
      savings: '27%',
      store: 'Amazon',
      rating: 4.6,
    },
  ];

  return (
    <section className="py-20 relative" style={{backgroundColor: '#FAFAFA'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/20 to-slate-50/20"></div>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Smart Price Comparison
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI scans thousands of stores in real-time to find you the absolute best prices 
            on healthy foods and supplements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-cyan-600 mb-2">₹20,500</div>
              <p className="text-gray-600">Average monthly savings</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-slate-600 mb-2">50,000+</div>
              <p className="text-gray-600">Products tracked daily</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-cyan-700 mb-2">2.3M+</div>
              <p className="text-gray-600">Happy customers</p>
            </div>
          </div>
        </div>

        {/* Best Deals */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            🔥 Today's Best Deals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{deal.savings}
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">{deal.name}</h4>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-cyan-600">
                      {formatPrice(deal.bestPrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(deal.avgPrice)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span>{deal.rating}</span>
                    </div>
                    <span className="font-medium">{deal.store}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/search?q=' + encodeURIComponent(deal.name))}
                    className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Find Best Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Real-time Price Tracking</h4>
              <p className="text-gray-600">
                Our AI monitors prices across hundreds of retailers 24/7 to ensure you never miss a deal.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Price Alerts</h4>
              <p className="text-gray-600">
                Get notified instantly when your favorite healthy foods drop to your target price.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-cyan-700" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Quality Verified</h4>
              <p className="text-gray-600">
                Every product is vetted by our nutrition experts to meet the highest quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;