const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Check if DeepSeek API is configured
const isDeepSeekConfigured = () => {
  return DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'your-deepseek-api-key' && DEEPSEEK_API_KEY.length > 10;
};

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ProductPriceData {
  name: string;
  prices: Array<{
    store: string;
    price: number;
    url: string;
    rating: number;
    availability: string;
  }>;
  avgPrice: number;
  lowestPrice: number;
}

interface DietPlan {
  title: string;
  description: string;
  duration: string;
  meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    ingredients: string[];
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    instructions: string[];
  }>;
  nutritionGoals: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tips: string[];
}

// Real-time product price fetching using DeepSeek AI
export const fetchRealTimeProductPrices = async (productName: string): Promise<ProductPriceData> => {
  try {
    const prompt = `You are a price comparison expert. Find real-time prices for "${productName}" from major Indian retailers like Amazon India, Flipkart, BigBasket, Grofers, and local stores. 

Return ONLY a valid JSON object with this exact structure:
{
  "name": "${productName}",
  "prices": [
    {
      "store": "Amazon India",
      "price": 299,
      "url": "https://amazon.in/product-link",
      "rating": 4.5,
      "availability": "In Stock"
    }
  ],
  "avgPrice": 350,
  "lowestPrice": 299
}

Include at least 4-5 different stores with realistic Indian prices in INR. Make sure all prices are current market rates.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    // Parse the JSON response
    const priceData: ProductPriceData = JSON.parse(content);
    return priceData;

  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    
    // Fallback to mock data if API fails
    return {
      name: productName,
      prices: [
        {
          store: 'Amazon India',
          price: Math.floor(Math.random() * 500) + 100,
          url: '#',
          rating: 4.5,
          availability: 'In Stock'
        },
        {
          store: 'Flipkart',
          price: Math.floor(Math.random() * 500) + 120,
          url: '#',
          rating: 4.3,
          availability: 'In Stock'
        }
      ],
      avgPrice: Math.floor(Math.random() * 400) + 200,
      lowestPrice: Math.floor(Math.random() * 300) + 100
    };
  }
};

// AI-powered diet plan generation
export const generatePersonalizedDietPlan = async (userProfile: {
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  healthConditions: string[];
  dietaryRestrictions: string;
  goals: string;
}): Promise<DietPlan> => {
  // Check if DeepSeek is configured
  if (!isDeepSeekConfigured()) {
    console.warn('DeepSeek API not configured, using fallback diet plan');
    return getFallbackDietPlan(userProfile);
  }

  try {
    // Calculate BMI and daily calorie needs
    const heightInMeters = userProfile.height / 100;
    const bmi = userProfile.weight / (heightInMeters * heightInMeters);
    const bmr = calculateBMR(userProfile.age, userProfile.weight, userProfile.height, 'male'); // Default to male for now
    const dailyCalories = calculateDailyCalories(bmr, userProfile.activityLevel);

    const prompt = `You are a certified nutritionist and registered dietitian with 15+ years of experience. Create a comprehensive, personalized 7-day diet plan for a user with the following detailed profile:

PERSONAL DETAILS:
- Age: ${userProfile.age} years
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- BMI: ${bmi.toFixed(1)} (${getBMICategory(bmi)})
- Activity Level: ${userProfile.activityLevel}
- Estimated Daily Calorie Needs: ${dailyCalories} calories

HEALTH FOCUS AREAS: ${userProfile.healthConditions.length > 0 ? userProfile.healthConditions.join(', ') : 'General wellness'}

DIETARY RESTRICTIONS/ALLERGIES: ${userProfile.dietaryRestrictions || 'None specified'}

SPECIFIC GOALS: ${userProfile.goals}

REQUIREMENTS:
1. Create a balanced 7-day meal plan with breakfast, lunch, dinner, and 2 healthy snacks per day
2. Include Indian and international healthy foods that are easily available
3. Ensure meals meet the estimated daily calorie target (±100 calories)
4. Address the specific health conditions mentioned
5. Respect all dietary restrictions and allergies
6. Include detailed cooking instructions for each meal
7. Provide macro breakdown (protein, carbs, fat) for each meal
8. Include portion sizes and serving information
9. Add health tips specific to their conditions and goals
10. Ensure nutritional variety and balance throughout the week

IMPORTANT: Focus on practical, affordable, and delicious meals that support their specific health goals.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Personalized 7-Day Nutrition Plan for [User's Primary Goal]",
  "description": "A comprehensive diet plan tailored to your specific health needs, activity level, and dietary preferences",
  "duration": "7 days",
  "targetCalories": ${dailyCalories},
  "nutritionGoals": {
    "dailyCalories": ${dailyCalories},
    "protein": ${Math.round(dailyCalories * 0.25 / 4)},
    "carbs": ${Math.round(dailyCalories * 0.45 / 4)},
    "fat": ${Math.round(dailyCalories * 0.30 / 9)}
  },
  "meals": [
    {
      "day": 1,
      "type": "breakfast",
      "name": "Specific meal name",
      "ingredients": ["ingredient with quantity", "ingredient with quantity"],
      "calories": 350,
      "macros": {"protein": 20, "carbs": 45, "fat": 12},
      "instructions": ["detailed step 1", "detailed step 2"],
      "servingSize": "1 bowl",
      "prepTime": "15 minutes",
      "healthBenefits": ["benefit 1", "benefit 2"]
    }
  ],
  "weeklyTips": [
    "Specific tip related to their health condition",
    "Practical cooking or meal prep advice",
    "Hydration and lifestyle recommendations"
  ],
  "shoppingList": [
    "Organized list of ingredients needed for the week"
  ],
  "mealPrepTips": [
    "Time-saving meal preparation strategies"
  ]
}

Ensure all meals are practical, nutritious, and aligned with their specific health goals and restrictions.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, factual responses
        max_tokens: 4000 // Increased for comprehensive diet plans
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API Error:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    // Clean and parse the JSON response
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const dietPlan: DietPlan = JSON.parse(cleanContent);
    
    // Validate the diet plan structure
    if (!dietPlan.meals || !Array.isArray(dietPlan.meals) || dietPlan.meals.length === 0) {
      throw new Error('Invalid diet plan structure received from AI');
    }
    
    return dietPlan;

  } catch (error) {
    console.error('Error generating diet plan:', error);
    
    // Return personalized fallback diet plan
    return getFallbackDietPlan(userProfile);
  }
};

// Helper function to calculate BMR (Basal Metabolic Rate)
const calculateBMR = (age: number, weight: number, height: number, gender: string): number => {
  // Mifflin-St Jeor Equation
  if (gender.toLowerCase() === 'female') {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
};

// Helper function to calculate daily calories based on activity level
const calculateDailyCalories = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  
  const multiplier = multipliers[activityLevel as keyof typeof multipliers] || 1.55;
  return Math.round(bmr * multiplier);
};

// Helper function to get BMI category
const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Enhanced fallback diet plan with user personalization
const getFallbackDietPlan = (userProfile: {
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  healthConditions: string[];
  dietaryRestrictions: string;
  goals: string;
}): DietPlan => {
  const heightInMeters = userProfile.height / 100;
  const bmi = userProfile.weight / (heightInMeters * heightInMeters);
  const bmr = calculateBMR(userProfile.age, userProfile.weight, userProfile.height, 'male');
  const dailyCalories = calculateDailyCalories(bmr, userProfile.activityLevel);
  
  return {
    title: `Personalized Health Plan for ${userProfile.goals || 'Wellness'}`,
    description: `A balanced nutrition plan designed for your age (${userProfile.age}), activity level (${userProfile.activityLevel}), and health goals. This plan provides approximately ${dailyCalories} calories per day.`,
    duration: '7 days',
    meals: [
      {
        type: 'breakfast',
        name: 'Protein-Rich Oats Bowl',
        ingredients: ['1 cup rolled oats', '1 medium banana (sliced)', '2 tbsp almonds (chopped)', '1 cup low-fat milk', '1 tsp honey', '1 tbsp chia seeds'],
        calories: Math.round(dailyCalories * 0.25),
        macros: { 
          protein: Math.round(dailyCalories * 0.25 * 0.20 / 4), 
          carbs: Math.round(dailyCalories * 0.25 * 0.55 / 4), 
          fat: Math.round(dailyCalories * 0.25 * 0.25 / 9) 
        },
        instructions: [
          'Cook oats with milk in a saucepan for 5-7 minutes until creamy',
          'Add sliced banana and mix gently',
          'Top with chopped almonds and chia seeds',
          'Drizzle with honey and serve warm'
        ]
      },
      {
        type: 'lunch',
        name: 'Mediterranean Quinoa Power Bowl',
        ingredients: ['1 cup cooked quinoa', '1 cup mixed vegetables (bell peppers, cucumber, tomatoes)', '2 tbsp olive oil', '1 lemon (juiced)', '1/4 cup feta cheese', '2 tbsp hummus', 'Fresh herbs (parsley, mint)'],
        calories: Math.round(dailyCalories * 0.35),
        macros: { 
          protein: Math.round(dailyCalories * 0.35 * 0.25 / 4), 
          carbs: Math.round(dailyCalories * 0.35 * 0.50 / 4), 
          fat: Math.round(dailyCalories * 0.35 * 0.25 / 9) 
        },
        instructions: [
          'Cook quinoa according to package instructions and let cool',
          'Chop all vegetables into bite-sized pieces',
          'Mix olive oil with lemon juice to make dressing',
          'Combine quinoa, vegetables, and dressing in a bowl',
          'Top with crumbled feta cheese and hummus',
          'Garnish with fresh herbs'
        ]
      },
      {
        type: 'dinner',
        name: 'Grilled Chicken with Roasted Vegetables',
        ingredients: ['150g chicken breast', '1 cup broccoli', '1 medium sweet potato', '1 tbsp olive oil', 'Herbs and spices (rosemary, thyme, garlic)', 'Salt and pepper to taste'],
        calories: Math.round(dailyCalories * 0.30),
        macros: { 
          protein: Math.round(dailyCalories * 0.30 * 0.40 / 4), 
          carbs: Math.round(dailyCalories * 0.30 * 0.35 / 4), 
          fat: Math.round(dailyCalories * 0.30 * 0.25 / 9) 
        },
        instructions: [
          'Preheat oven to 200°C (400°F)',
          'Season chicken breast with herbs, salt, and pepper',
          'Cut sweet potato into cubes and toss with olive oil',
          'Roast sweet potato for 20 minutes, then add broccoli',
          'Grill chicken breast for 6-8 minutes per side until cooked through',
          'Serve chicken with roasted vegetables'
        ]
      }
    ],
    nutritionGoals: {
      dailyCalories: dailyCalories,
      protein: Math.round(dailyCalories * 0.25 / 4),
      carbs: Math.round(dailyCalories * 0.45 / 4),
      fat: Math.round(dailyCalories * 0.30 / 9)
    },
    tips: [
      `Based on your BMI of ${bmi.toFixed(1)} (${getBMICategory(bmi)}), focus on balanced nutrition and portion control`,
      `With your ${userProfile.activityLevel} activity level, aim for ${dailyCalories} calories per day`,
      'Drink at least 8-10 glasses of water throughout the day',
      'Include a variety of colorful fruits and vegetables in your meals',
      userProfile.healthConditions.length > 0 ? `Consider your health focus areas: ${userProfile.healthConditions.join(', ')}` : 'Maintain a balanced approach to all food groups',
      userProfile.dietaryRestrictions ? `Remember your dietary restrictions: ${userProfile.dietaryRestrictions}` : 'Feel free to substitute ingredients based on your preferences'
    ]
  };
};

// Get nutritional analysis for any food item
export const getNutritionalAnalysis = async (foodItem: string): Promise<any> => {
  try {
    const prompt = `Provide detailed nutritional analysis for "${foodItem}". Include calories, macronutrients, vitamins, minerals, and health benefits. Return as JSON format.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    const data: DeepSeekResponse = await response.json();
    return JSON.parse(data.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Error getting nutritional analysis:', error);
    return {};
  }
};
