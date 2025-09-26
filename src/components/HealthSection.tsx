import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Zap, Shield, Target, TrendingUp } from 'lucide-react';

const HealthSection: React.FC = () => {
  const navigate = useNavigate();

  const healthConditions = [
    {
      icon: Heart,
      title: 'Heart Health',
      description: 'Personalized diet plans for cardiovascular wellness',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Brain,
      title: 'Brain Function',
      description: 'Optimize cognitive performance with targeted nutrition',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Energy Levels',
      description: 'Boost daily energy with strategic meal planning',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Shield,
      title: 'Immune System',
      description: 'Strengthen immunity with nutrient-rich foods',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Target,
      title: 'Weight Management',
      description: 'Achieve your ideal weight with personalized plans',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Performance',
      description: 'Enhance athletic performance through nutrition',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-20 relative" style={{backgroundColor: '#FAFAFA'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-transparent"></div>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            AI-Powered Health Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI analyzes your health conditions, preferences, and goals to create 
            personalized diet plans that work specifically for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {healthConditions.map((condition, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className={`${condition.bgColor} rounded-2xl p-8 h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300`}>
                <div className={`${condition.color} mb-4`}>
                  <condition.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{condition.title}</h3>
                <p className="text-gray-600 leading-relaxed">{condition.description}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-gray-700 group-hover:text-cyan-600 transition-colors">
                  Learn More →
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-cyan-600 to-slate-600 rounded-3xl p-8 md:p-12 text-center text-white relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Health?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Get your personalized diet plan and start comparing prices on healthy foods today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/diet-plan')}
              className="bg-white text-cyan-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Assessment
            </button>
            <button 
              onClick={() => navigate('/diet-plan')}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthSection;