import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Brain, Zap, Shield, Target, TrendingUp, CheckCircle, Loader } from 'lucide-react';
import { generatePersonalizedDietPlan } from '../services/deepseekService';

const DietPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking');
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    dietaryRestrictions: '',
    goals: ''
  });

  useEffect(() => {
    // Check if DeepSeek API is configured
    const checkApiStatus = () => {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (apiKey && apiKey !== 'your-deepseek-api-key' && apiKey.length > 10) {
        setApiStatus('configured');
      } else {
        setApiStatus('not-configured');
      }
    };
    
    checkApiStatus();
  }, []);

  const healthConditions = [
    { id: 'heart', name: 'Heart Health', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
    { id: 'brain', name: 'Brain Function', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'energy', name: 'Energy Levels', icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { id: 'immunity', name: 'Immune System', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 'weight', name: 'Weight Management', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'performance', name: 'Athletic Performance', icon: TrendingUp, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  ];

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedConditions.length === 0) {
      alert('Please select at least one health focus area to get a personalized plan.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const userProfile = {
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        healthConditions: selectedConditions,
        dietaryRestrictions: formData.dietaryRestrictions,
        goals: formData.goals
      };
      
      const dietPlan = await generatePersonalizedDietPlan(userProfile);
      setGeneratedPlan(dietPlan);
      
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert(`Sorry, there was an error generating your diet plan: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // If diet plan is generated, show the plan
  if (generatedPlan) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#FAFAFA'}}>
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGeneratedPlan(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Your Personalized Diet Plan</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{generatedPlan.title}</h2>
              <p className="text-gray-600 mb-6">{generatedPlan.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-cyan-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-cyan-600">{generatedPlan.nutritionGoals.dailyCalories}</div>
                  <div className="text-sm text-gray-600">Daily Calories</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{generatedPlan.nutritionGoals.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-yellow-600">{generatedPlan.nutritionGoals.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">{generatedPlan.nutritionGoals.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
              
              {apiStatus === 'not-configured' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <span className="font-semibold">⚠️ Using Basic Plan:</span>
                    <span>Connect DeepSeek AI for fully personalized recommendations</span>
                  </div>
                </div>
              )}
            </div>

            {/* Meal Plans */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Daily Meal Plan</h3>
              <div className="space-y-6">
                {generatedPlan.meals.map((meal: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 capitalize">{meal.type}</h4>
                        {meal.day && <span className="text-sm text-gray-500">Day {meal.day}</span>}
                      </div>
                      <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {meal.calories} cal
                      </span>
                    </div>
                    
                    <h5 className="text-lg font-semibold text-gray-700 mb-3">{meal.name}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h6 className="font-semibold text-gray-700 mb-2">Ingredients:</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {meal.ingredients.map((ingredient: string, idx: number) => (
                            <li key={idx}>• {ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-semibold text-gray-700 mb-2">Macros:</h6>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Protein: {meal.macros.protein}g</div>
                          <div>Carbs: {meal.macros.carbs}g</div>
                          <div>Fat: {meal.macros.fat}g</div>
                        </div>
                      </div>
                      
                      {(meal.servingSize || meal.prepTime) && (
                        <div>
                          <h6 className="font-semibold text-gray-700 mb-2">Details:</h6>
                          <div className="text-sm text-gray-600 space-y-1">
                            {meal.servingSize && <div>Serving: {meal.servingSize}</div>}
                            {meal.prepTime && <div>Prep: {meal.prepTime}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h6 className="font-semibold text-gray-700 mb-2">Instructions:</h6>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {meal.instructions.map((instruction: string, idx: number) => (
                          <li key={idx}>{idx + 1}. {instruction}</li>
                        ))}
                      </ol>
                    </div>
                    
                    {meal.healthBenefits && meal.healthBenefits.length > 0 && (
                      <div className="mt-4">
                        <h6 className="font-semibold text-gray-700 mb-2">Health Benefits:</h6>
                        <div className="flex flex-wrap gap-2">
                          {meal.healthBenefits.map((benefit: string, idx: number) => (
                            <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips and Additional Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {apiStatus === 'configured' ? 'AI-Powered Health Tips' : 'Personalized Health Tips'}
              </h3>
              <div className="space-y-3">
                {(generatedPlan.tips || generatedPlan.weeklyTips || []).map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
              
              {generatedPlan.shoppingList && generatedPlan.shoppingList.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Shopping List</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {generatedPlan.shoppingList.map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {generatedPlan.mealPrepTips && generatedPlan.mealPrepTips.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Meal Prep Tips</h4>
                  <div className="space-y-2">
                    {generatedPlan.mealPrepTips.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">💡</span>
                        <p className="text-gray-700 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FAFAFA'}}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Personalized Diet Plan</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Get Your {apiStatus === 'configured' ? 'AI-Powered' : 'Personalized'} Diet Plan
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about your health goals and we'll create a {apiStatus === 'configured' ? 'fully personalized AI-generated' : 'customized'} nutrition plan just for you
            </p>
            
            {apiStatus === 'not-configured' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <p className="text-blue-800">
                  <strong>💡 Pro Tip:</strong> Connect your DeepSeek AI API key for fully personalized, AI-generated diet plans based on the latest nutritional science!
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Health Conditions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Select Your Health Focus Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthConditions.map((condition) => (
                  <div
                    key={condition.id}
                    onClick={() => toggleCondition(condition.id)}
                    className={`${condition.bgColor} rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                      selectedConditions.includes(condition.id)
                        ? 'border-cyan-500 ring-2 ring-cyan-200'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <condition.icon className={`w-8 h-8 ${condition.color}`} />
                      {selectedConditions.includes(condition.id) && (
                        <CheckCircle className="w-6 h-6 text-cyan-600" />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800">{condition.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your age"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your weight"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your height"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very-active">Very Active (2x/day, intense)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dietary Restrictions or Allergies
                  </label>
                  <textarea
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    placeholder="e.g., Vegetarian, Gluten-free, Nut allergies..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Health Goals
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    placeholder="Describe your specific health and nutrition goals..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-cyan-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-cyan-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  'Generate My Diet Plan'
                )}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                {isGenerating 
                  ? (apiStatus === 'configured' ? 'DeepSeek AI is creating your personalized plan...' : 'Creating your personalized plan...') 
                  : `Your ${apiStatus === 'configured' ? 'AI-powered' : 'personalized'} plan will be ready in seconds`
                }
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DietPlanPage;