import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Trash2 } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { fetchDailySummary, fetchMeals, fetchFoods } from '@/lib/api';
import { formatDate, toISODateString } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

// Temporary user ID for demo
const DEMO_USER_ID = 1;

export default function NutritionTracker() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  
  // Fetch daily summary
  const { data: summary = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  } } = useQuery({
    queryKey: ['/api/daily-summaries', DEMO_USER_ID, toISODateString(selectedDate)],
    queryFn: () => fetchDailySummary(DEMO_USER_ID, toISODateString(selectedDate))
  });
  
  // Fetch meals for selected date
  const { data: meals = [] } = useQuery({
    queryKey: ['/api/meals', DEMO_USER_ID, toISODateString(selectedDate)],
    queryFn: () => fetchMeals(DEMO_USER_ID, toISODateString(selectedDate))
  });
  
  // Fetch all foods for food selection
  const { data: foods = [] } = useQuery({
    queryKey: ['/api/foods'],
    queryFn: () => fetchFoods()
  });
  
  // User nutrition targets - in a real app, this would come from user profile
  const userTargets = {
    calorieTarget: 2000,
    proteinTarget: 90,
    carbsTarget: 250,
    fatTarget: 67
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };
  
  const handleAddFood = () => {
    setIsAddFoodDialogOpen(false);
    toast({
      title: "Food logged",
      description: "Your food has been added to your nutrition log.",
    });
  };
  
  const handleDeleteMeal = (mealId: number) => {
    toast({
      title: "Meal removed",
      description: "The meal has been removed from your log.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Nutrition Tracker</h2>
          <p className="text-gray-600">Track your daily nutrition and stay on target</p>
        </div>
        
        <Dialog open={isAddFoodDialogOpen} onOpenChange={setIsAddFoodDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Log Food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Food</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meal Type</label>
                  <Select defaultValue="breakfast">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" defaultValue="12:00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Food</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search for a food" className="pl-8" />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-gray-50">
                {foods.map(food => (
                  <div key={food.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-gray-500">{food.servingSize} • {food.calories} cal</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </div>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Selected Foods</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <div>
                      <div className="font-medium">Greek Yogurt</div>
                      <div className="text-xs text-gray-500">1 cup • 100 cal</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleAddFood}>
                Log Food
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4">Date Selection</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Input 
                    type="date" 
                    value={toISODateString(selectedDate)} 
                    onChange={handleDateChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Nutrition Summary</h4>
                  <div className="bg-[#F5F5F5] p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <div className="text-xs text-gray-500">Calories</div>
                        <div className="text-sm font-semibold">{summary.totalCalories} / {userTargets.calorieTarget}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Protein</div>
                        <div className="text-sm font-semibold">{summary.totalProtein}g / {userTargets.proteinTarget}g</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Carbs</div>
                        <div className="text-sm font-semibold">{summary.totalCarbs}g / {userTargets.carbsTarget}g</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Fat</div>
                        <div className="text-sm font-semibold">{summary.totalFat}g / {userTargets.fatTarget}g</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-4">
                      <CircularProgress
                        value={summary.totalCalories}
                        max={userTargets.calorieTarget}
                        size={60}
                        color="primary"
                        label={
                          <div className="text-center">
                            <div className="text-[10px] text-gray-500">Cal</div>
                            <div className="text-xs font-bold">{Math.round((summary.totalCalories / userTargets.calorieTarget) * 100)}%</div>
                          </div>
                        }
                      />
                      
                      <CircularProgress
                        value={summary.totalProtein}
                        max={userTargets.proteinTarget}
                        size={60}
                        color="secondary"
                        label={
                          <div className="text-center">
                            <div className="text-[10px] text-gray-500">Prot</div>
                            <div className="text-xs font-bold">{Math.round((summary.totalProtein / userTargets.proteinTarget) * 100)}%</div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-5">
              <Tabs defaultValue="log">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Nutrition for {formatDate(selectedDate)}</h3>
                  <TabsList>
                    <TabsTrigger value="log">Food Log</TabsTrigger>
                    <TabsTrigger value="macros">Macros</TabsTrigger>
                    <TabsTrigger value="chart">Charts</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="log" className="mt-0">
                  <div className="space-y-6">
                    {meals.length > 0 ? (
                      <>
                        {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                          const mealsOfType = meals.filter(meal => meal.type === mealType);
                          if (mealsOfType.length === 0) return null;
                          
                          return (
                            <div key={mealType} className="space-y-3">
                              <h4 className="font-semibold capitalize">{mealType}</h4>
                              
                              {mealsOfType.map(meal => (
                                <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                                      <img 
                                        src={meal.imageUrl || 'https://via.placeholder.com/40'} 
                                        alt={meal.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">{meal.name}</h5>
                                      <div className="flex space-x-2 text-xs text-gray-500">
                                        <span>{meal.time}</span>
                                        <span>•</span>
                                        <span>{meal.calories} cal</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <div className="text-xs text-gray-500">
                                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDeleteMeal(meal.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <h4 className="text-gray-500 mb-4">No foods logged for this day</h4>
                        <Button 
                          onClick={() => setIsAddFoodDialogOpen(true)} 
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Log Your First Food
                        </Button>
                      </div>
                    )}
                    
                    {meals.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
                        onClick={() => setIsAddFoodDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Log More Food
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="macros" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Macronutrient Breakdown</h4>
                      
                      <div className="flex justify-center space-x-8">
                        <div className="flex flex-col items-center">
                          <CircularProgress
                            value={summary.totalProtein}
                            max={userTargets.proteinTarget}
                            size={100}
                            color="secondary"
                          />
                          <div className="mt-2 text-center">
                            <div className="text-sm font-medium">Protein</div>
                            <div className="text-xs text-gray-500">{summary.totalProtein}g / {userTargets.proteinTarget}g</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <CircularProgress
                            value={summary.totalCarbs}
                            max={userTargets.carbsTarget}
                            size={100}
                            color="accent"
                          />
                          <div className="mt-2 text-center">
                            <div className="text-sm font-medium">Carbs</div>
                            <div className="text-xs text-gray-500">{summary.totalCarbs}g / {userTargets.carbsTarget}g</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <CircularProgress
                            value={summary.totalFat}
                            max={userTargets.fatTarget}
                            size={100}
                            color="destructive"
                          />
                          <div className="mt-2 text-center">
                            <div className="text-sm font-medium">Fat</div>
                            <div className="text-xs text-gray-500">{summary.totalFat}g / {userTargets.fatTarget}g</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Calorie Summary</h4>
                      
                      <div className="bg-[#F5F5F5] p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span>Total Calories</span>
                          <span className="font-semibold">{summary.totalCalories} cal</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Calorie Target</span>
                          <span className="font-semibold">{userTargets.calorieTarget} cal</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Remaining</span>
                          <span className="font-semibold text-green-600">
                            {Math.max(0, userTargets.calorieTarget - summary.totalCalories)} cal
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Macro Distribution</h4>
                        <div className="h-4 rounded-full overflow-hidden bg-gray-200">
                          {summary.totalCalories > 0 && (
                            <div className="flex h-full">
                              <div 
                                className="bg-blue-500" 
                                style={{ width: `${(summary.totalProtein * 4 / summary.totalCalories) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-orange-500" 
                                style={{ width: `${(summary.totalCarbs * 4 / summary.totalCalories) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-red-500" 
                                style={{ width: `${(summary.totalFat * 9 / summary.totalCalories) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                            <span>Protein</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                            <span>Carbs</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span>Fat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart" className="mt-0">
                  <div className="text-center py-10">
                    <p className="text-gray-500">Detailed nutrition charts and analytics coming soon!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
