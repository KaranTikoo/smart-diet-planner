import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { getWeekdays, formatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface MealPlanDay {
  date: string;
  meals: {
    type: string;
    name: string;
  }[];
}

interface WeeklyPlanProps {
  currentDate: Date;
  weekPlan: MealPlanDay[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onViewFullPlan: () => void;
}

export function WeeklyPlan({ 
  currentDate, 
  weekPlan, 
  onPrevWeek, 
  onNextWeek, 
  onViewFullPlan 
}: WeeklyPlanProps) {
  const weekdays = getWeekdays(currentDate);
  
  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Weekly Meal Plan</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="p-1 rounded hover:bg-gray-100" onClick={onPrevWeek}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1 rounded hover:bg-gray-100" onClick={onNextWeek}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekdays.map((day) => (
                <div 
                  key={day.formattedDate}
                  className={cn(
                    "text-center font-medium text-sm p-1",
                    day.isToday && "bg-primary bg-opacity-10 rounded"
                  )}
                >
                  {day.dayName}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekdays.map((day) => {
                const planForDay = weekPlan.find(p => p.date === day.formattedDate);
                const breakfastMeal = planForDay?.meals.find(m => m.type === 'breakfast');
                
                return (
                  <div 
                    key={day.formattedDate}
                    className={cn(
                      "p-2 text-center border rounded",
                      day.isToday 
                        ? "border-primary border-opacity-30 bg-primary bg-opacity-5" 
                        : "border-gray-100"
                    )}
                  >
                    <div className="text-xs text-gray-500 mb-1">Breakfast</div>
                    <div className="text-xs font-medium truncate">
                      {breakfastMeal?.name || 'Not planned'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
          onClick={onViewFullPlan}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          View Full Weekly Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
