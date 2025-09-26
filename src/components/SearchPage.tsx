import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, ArrowLeft, Loader } from 'lucide-react';
import { searchProducts, formatPrice } from '../services/searchService';
import { SearchResult } from '../types';
import { useCart } from '../context/CartContext';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Show loading message for real-time pricing
      console.log('Fetching real-time prices using DeepSeek AI...');
      const searchResults = await searchProducts(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (result: SearchResult) => {
    const product = {
      id: parseInt(result.id.split('-')[2]),
      name: result.name,
      image: result.image,
      price: result.ourPrice,
      originalPrice: result.lowestPrice,
      rating: result.rating,
      reviews: result.reviews,
      time: '15 min',
      servings: 2,
      healthBenefits: ['Organic', 'Fresh', 'Healthy'],
      category: 'lunch' as const
    };
    
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAFAFA'}}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
          </div>
          
          <form onSubmit={onSearchSubmit} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for healthy foods, supplements..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-cyan-600" />
            <span className="ml-3 text-lg text-gray-600">AI is finding the best prices across all stores...</span>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {results.length} real-time results for "{query}" • Powered by AI • Prices include 10% service fee
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Best Price
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{result.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-cyan-600">
                        {formatPrice(result.ourPrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(result.lowestPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{result.rating.toFixed(1)}</span>
                        <span>({result.reviews})</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {result.source}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(result)}
                      className="w-full bg-cyan-600 text-white py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : query && !loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try searching for different keywords</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;