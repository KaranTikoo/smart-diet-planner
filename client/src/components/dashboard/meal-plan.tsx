import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatTimeDisplay } from '@/lib/date-utils';

interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

interface MealProps {
  id: number;
  name: string;
  time: string;
  description: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: FoodItem[];
}

interface MealPlanProps {
  meals: MealProps[];
  onAddMeal: () => void;
  onViewFullPlan: () => void;
}

function MealCard({ meal }: { meal: MealProps }) {
  return (
    <div className="mb-4 p-4 border border-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{meal.name}</h4>
        <span className="text-xs text-gray-500">{formatTimeDisplay(meal.time)}</span>
      </div>
      
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={meal.imageUrl} 
            alt={meal.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h5 className="font-medium">{meal.name}</h5>
          <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
          <div className="flex space-x-3 text-xs">
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">{meal.calories} cal</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{meal.protein}g protein</span>
            <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full">{meal.carbs}g carbs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MealPlan({ meals, onAddMeal, onViewFullPlan }: MealPlanProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Meal Plan</h3>
          <Button 
            variant="ghost" 
            className="text-sm text-[#2196F3] font-medium p-0 h-auto" 
            onClick={onViewFullPlan}
          >
            View Full Plan
          </Button>
        </div>
        
        {meals.length > 0 ? (
          meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No meals planned for today</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          variant="outline" 
          className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
          onClick={onAddMeal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Meal
        </Button>
      </CardFooter>
    </Card>
  );
}
