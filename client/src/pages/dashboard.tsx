import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { NutritionSummary } from '@/components/dashboard/nutrition-summary';
import { MealPlan } from '@/components/dashboard/meal-plan';
import { MealSuggestions } from '@/components/dashboard/meal-suggestions';
import { WeeklyPlan } from '@/components/dashboard/weekly-plan';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { fetchDailySummary, fetchMeals, fetchFoods } from '@/lib/api';
import { formatDate, toISODateString } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

// Temporary user ID for demo
const DEMO_USER_ID = 1;

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Fetch daily summary
  const { data: summary = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  } } = useQuery({
    queryKey: ['/api/daily-summaries', DEMO_USER_ID, toISODateString(currentDate)],
    queryFn: () => fetchDailySummary(DEMO_USER_ID, toISODateString(currentDate))
  });
  
  // Fetch today's meals
  const { data: todaysMeals = [] } = useQuery({
    queryKey: ['/api/meals', DEMO_USER_ID, toISODateString(currentDate)],
    queryFn: () => fetchMeals(DEMO_USER_ID, toISODateString(currentDate))
  });
  
  // Fetch meal suggestions (using some of the foods)
  const { data: foods = [] } = useQuery({
    queryKey: ['/api/foods'],
    queryFn: () => fetchFoods()
  });
  
  // Create meal suggestions from foods
  const mealSuggestions = foods.slice(0, 3).map(food => ({
    id: food.id,
    name: food.name,
    calories: food.calories,
    protein: food.protein,
    imageUrl: food.imageUrl || ''
  }));
  
  // Format meals for the component
  const formattedMeals = todaysMeals.map(meal => ({
    id: meal.id,
    name: meal.name,
    time: meal.time,
    description: meal.description || '',
    imageUrl: meal.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    foods: meal.foods as any[] || []
  }));
  
  // Mock weekly plan data - in a real app, this would come from API
  const weekPlan = [
    {
      date: toISODateString(currentDate),
      meals: [
        { type: 'breakfast', name: 'Yogurt Bowl' }
      ]
    }
  ];
  
  // User nutrition targets - in a real app, this would come from user profile
  const userTargets = {
    calorieTarget: 2000,
    proteinTarget: 90,
    carbsTarget: 250,
    fatTarget: 67
  };
  
  // Event handlers
  const handleAddMeal = () => {
    navigate('/meal-planner');
  };
  
  const handleViewFullPlan = () => {
    navigate('/meal-planner');
  };
  
  const handleViewMoreSuggestions = () => {
    navigate('/food-database');
  };
  
  const handleSelectSuggestion = (suggestion: any) => {
    toast({
      title: "Meal selected",
      description: `${suggestion.name} has been added to your plan.`,
    });
  };
  
  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };
  
  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };
  
  const handleLogFood = () => {
    navigate('/nutrition-tracker');
  };
  
  const handleShoppingList = () => {
    toast({
      title: "Shopping List",
      description: "This feature is coming soon!",
    });
  };
  
  const handleRecipeSearch = () => {
    navigate('/food-database');
  };
  
  const handleNutritionReport = () => {
    navigate('/nutrition-tracker');
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Dashboard</h2>
        <p className="text-gray-600">Welcome back, Jane! Track your nutrition and plan your meals.</p>
      </div>
      
      {/* Nutrition Summary */}
      <NutritionSummary 
        summary={summary} 
        targets={userTargets} 
        date={currentDate} 
      />
      
      {/* Meal Plan Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MealPlan 
            meals={formattedMeals} 
            onAddMeal={handleAddMeal} 
            onViewFullPlan={handleViewFullPlan} 
          />
        </div>
        
        <div>
          <MealSuggestions 
            suggestions={mealSuggestions} 
            onViewMore={handleViewMoreSuggestions} 
            onSelectSuggestion={handleSelectSuggestion} 
          />
        </div>
      </div>
      
      {/* Weekly Plan Preview */}
      <WeeklyPlan 
        currentDate={currentDate} 
        weekPlan={weekPlan} 
        onPrevWeek={handlePrevWeek} 
        onNextWeek={handleNextWeek} 
        onViewFullPlan={handleViewFullPlan} 
      />
      
      {/* Quick Actions */}
      <QuickActions 
        onLogFood={handleLogFood} 
        onShoppingList={handleShoppingList} 
        onRecipeSearch={handleRecipeSearch} 
        onNutritionReport={handleNutritionReport} 
      />
    </div>
  );
}
