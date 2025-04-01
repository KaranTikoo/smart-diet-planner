import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { formatDate } from '@/lib/date-utils';

interface NutritionSummaryProps {
  summary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  targets: {
    calorieTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatTarget: number;
  };
  date?: Date;
}

export function NutritionSummary({ summary, targets, date = new Date() }: NutritionSummaryProps) {
  const { totalCalories, totalProtein, totalCarbs, totalFat } = summary;
  const { calorieTarget, proteinTarget, carbsTarget, fatTarget } = targets;
  
  // Format numbers with commas
  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  const nutrients = [
    { 
      label: 'Calories', 
      current: totalCalories, 
      target: calorieTarget, 
      color: 'primary',
      unit: ''
    },
    { 
      label: 'Protein', 
      current: totalProtein, 
      target: proteinTarget, 
      color: 'secondary',
      unit: 'g'
    },
    { 
      label: 'Carbs', 
      current: totalCarbs, 
      target: carbsTarget, 
      color: 'accent',
      unit: 'g'
    },
    { 
      label: 'Fat', 
      current: totalFat, 
      target: fatTarget, 
      color: 'destructive',
      unit: 'g'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Nutrition</h3>
          <div className="text-sm text-gray-500">{formatDate(date)}</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nutrients.map((nutrient) => (
            <div key={nutrient.label} className="p-4 rounded-lg bg-[#F5F5F5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{nutrient.label}</span>
                <div>
                  <span className="text-sm font-semibold">{formatNumber(nutrient.current)}{nutrient.unit}</span>
                  <span className="text-sm text-gray-500"> / {formatNumber(nutrient.target)}{nutrient.unit}</span>
                </div>
              </div>
              <CircularProgress 
                value={nutrient.current} 
                max={nutrient.target} 
                color={nutrient.color as any}
                className="mx-auto"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
