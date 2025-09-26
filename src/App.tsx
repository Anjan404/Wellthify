import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import PriceComparison from './components/PriceComparison';
import HealthSection from './components/HealthSection';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import CartPage from './components/CartPage';
import DietPlanPage from './components/DietPlanPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import PasswordResetPage from './components/PasswordResetPage';
import { breakfastItems, lunchItems, dinnerItems, snackItems } from './data/foodData';

const HomePage: React.FC = () => (
  <>
    <Hero />
    
    <CategorySection
      title="Breakfast"
      emoji="🌅"
      items={breakfastItems}
      bgColor=""
      accentColor="bg-cyan-500"
    />
    
    <CategorySection
      title="Lunch"
      emoji="☀️"
      items={lunchItems}
      bgColor=""
      accentColor="bg-cyan-600"
    />
    
    <CategorySection
      title="Dinner"
      emoji="🌙"
      items={dinnerItems}
      bgColor=""
      accentColor="bg-slate-600"
    />
    
    <CategorySection
      title="Snacks"
      emoji="🍎"
      items={snackItems}
      bgColor=""
      accentColor="bg-cyan-500"
    />

    <PriceComparison />
    <HealthSection />
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/diet-plan" element={<DietPlanPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;