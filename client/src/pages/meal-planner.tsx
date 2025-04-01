import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Plus, Search } from 'lucide-react';
import { fetchMeals, fetchFoods } from '@/lib/api';
import { formatDate, toISODateString } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

// Temporary user ID for demo
const DEMO_USER_ID = 1;

export default function MealPlanner() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);
  
  // Fetch meals for selected date
  const { data: meals = [] } = useQuery({
    queryKey: ['/api/meals', DEMO_USER_ID, toISODateString(selectedDate)],
    queryFn: () => fetchMeals(DEMO_USER_ID, toISODateString(selectedDate))
  });
  
  // Fetch all foods for meal creation
  const { data: foods = [] } = useQuery({
    queryKey: ['/api/foods'],
    queryFn: () => fetchFoods()
  });
  
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const handleAddMeal = () => {
    setIsAddMealDialogOpen(false);
    toast({
      title: "Meal added",
      description: "Your meal has been added to the plan.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Meal Planner</h2>
          <p className="text-gray-600">Plan and organize your meals for optimal nutrition</p>
        </div>
        
        <Dialog open={isAddMealDialogOpen} onOpenChange={setIsAddMealDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
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
                      {mealTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" defaultValue="08:00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Name</label>
                <Input placeholder="Enter meal name" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Brief description of the meal" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Foods</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search foods to add" className="pl-8" />
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
                  {foods.slice(0, 5).map(food => (
                    <div key={food.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                      <div>
                        <div className="font-medium text-sm">{food.name}</div>
                        <div className="text-xs text-gray-500">{food.calories} cal, {food.protein}g protein</div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Add</Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleAddMeal}>
                Add to Meal Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4">Calendar</h3>
              
              <div className="bg-white rounded-lg">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Date</h4>
                <div className="flex items-center space-x-2 text-gray-700">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-5">
              <Tabs defaultValue="all">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Meals for {formatDate(selectedDate)}</h3>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {mealTypes.map(type => (
                      <TabsTrigger key={type} value={type} className="capitalize">{type}</TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  {meals.length > 0 ? (
                    <div className="space-y-4">
                      {meals.map(meal => (
                        <div key={meal.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold capitalize">{meal.type}</h4>
                                <span className="text-xs text-gray-500">• {meal.time}</span>
                              </div>
                              <h3 className="text-lg font-medium mt-1">{meal.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-1">
                              <div className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                                {meal.calories} cal
                              </div>
                              <div className="text-xs text-gray-500">
                                P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50"
                        onClick={() => setIsAddMealDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Meal
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h4 className="text-gray-500 mb-4">No meals planned for this day</h4>
                      <Button 
                        onClick={() => setIsAddMealDialogOpen(true)} 
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Meal
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {mealTypes.map(type => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <div className="space-y-4">
                      {meals.filter(meal => meal.type === type).length > 0 ? (
                        <>
                          {meals
                            .filter(meal => meal.type === type)
                            .map(meal => (
                              <div key={meal.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">{meal.time}</span>
                                    </div>
                                    <h3 className="text-lg font-medium mt-1">{meal.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                                  </div>
                                  
                                  <div className="flex flex-col items-end space-y-1">
                                    <div className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                                      {meal.calories} cal
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </>
                      ) : (
                        <div className="text-center py-10">
                          <h4 className="text-gray-500 mb-4">No {type} planned for this day</h4>
                          <Button 
                            onClick={() => setIsAddMealDialogOpen(true)} 
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
