import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import FoodCloud from './FoodCloud';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 overflow-hidden" style={{backgroundColor: '#FAFAFA'}}>
      <FoodCloud isAnimating={isScrolled} />
      
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-cyan-600 fill-current" />
          <span className="text-2xl font-bold text-gray-800">Wellthify</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigate('/search')}
            className="text-gray-700 hover:text-cyan-600 transition-colors"
          >
            Price Compare
          </button>
          <button 
            onClick={() => navigate('/diet-plan')}
            className="text-gray-700 hover:text-cyan-600 transition-colors"
          >
            Diet Plans
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="text-gray-700 hover:text-cyan-600 transition-colors relative"
          >
            Cart
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {profile?.full_name || user.email}
              </span>
              <button 
                onClick={handleSignOut}
                className="text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/signin')}
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={() => navigate('/diet-plan')}
            className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition-colors"
          >
            Get Started
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-sm"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={() => navigate('/signin')}
              className="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 transition-colors text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-8 min-h-[calc(100vh-120px)]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Your Health,
            <span className="text-cyan-600"> Optimized</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Find the lowest prices for healthy foods while getting personalized diet plans 
            tailored to your specific health conditions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/search')}
              className="bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Compare Prices
            </button>
            <button 
              onClick={() => navigate('/diet-plan')}
              className="bg-slate-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Get Diet Plan
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for healthy foods, supplements, or diet plans..."
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-lg text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;