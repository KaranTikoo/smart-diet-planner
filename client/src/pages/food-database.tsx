import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Info } from 'lucide-react';
import { fetchFoods } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function FoodDatabase() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodGroup, setSelectedFoodGroup] = useState('all');
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Fetch all foods
  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['/api/foods', searchQuery, selectedFoodGroup !== 'all' ? selectedFoodGroup : undefined],
    queryFn: () => fetchFoods(
      searchQuery, 
      selectedFoodGroup !== 'all' ? selectedFoodGroup : undefined
    )
  });
  
  const foodGroups = [
    { value: 'all', label: 'All Food Groups' },
    { value: 'protein', label: 'Proteins' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'nuts', label: 'Nuts & Seeds' }
  ];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFoodGroupChange = (value: string) => {
    setSelectedFoodGroup(value);
  };
  
  const handleAddFood = () => {
    setIsAddFoodDialogOpen(false);
    toast({
      title: "Food added",
      description: "The food has been added to the database.",
    });
  };
  
  const showFoodDetails = (food: any) => {
    setSelectedFood(food);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Food Database</h2>
          <p className="text-gray-600">Browse, search, and add foods to your meal plan</p>
        </div>
        
        <Dialog open={isAddFoodDialogOpen} onOpenChange={setIsAddFoodDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Food</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Food Name</label>
                <Input placeholder="Enter food name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Food Group</label>
                  <Select defaultValue="protein">
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodGroups.slice(1).map(group => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Serving Size</label>
                  <Input placeholder="e.g. 1 cup (240g)" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Calories</label>
                  <Input type="number" placeholder="kcal" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protein (g)</label>
                  <Input type="number" placeholder="grams" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Carbs (g)</label>
                  <Input type="number" placeholder="grams" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fat (g)</label>
                  <Input type="number" placeholder="grams" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input placeholder="Brief description of the food" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL (optional)</label>
                <Input placeholder="http://example.com/image.jpg" />
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleAddFood}>
                Add Food
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Food detail dialog */}
      {selectedFood && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedFood.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="flex mb-4">
                {selectedFood.imageUrl && (
                  <div className="w-24 h-24 rounded-md overflow-hidden mr-4">
                    <img 
                      src={selectedFood.imageUrl} 
                      alt={selectedFood.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-lg">{selectedFood.name}</h3>
                  <p className="text-sm text-gray-600">{selectedFood.description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Serving:</span> {selectedFood.servingSize}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Food Group:</span> {selectedFood.foodGroup}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-semibold">{selectedFood.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="font-semibold">{selectedFood.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="font-semibold">{selectedFood.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="font-semibold">{selectedFood.fat}g</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">Add to Favorites</Button>
                <Button className="bg-primary hover:bg-primary/90">Add to Meal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search foods..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="w-full md:w-64">
                <Select 
                  value={selectedFoodGroup} 
                  onValueChange={handleFoodGroupChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food group" />
                  </SelectTrigger>
                  <SelectContent>
                    {foodGroups.map(group => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Foods ({foods.length})</h3>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, a6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foods.map(food => (
                <Card key={food.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="h-40 bg-gray-200 relative"
                    onClick={() => showFoodDetails(food)}
                  >
                    {food.imageUrl ? (
                      <img 
                        src={food.imageUrl} 
                        alt={food.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer">
                      <Info className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium truncate">{food.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{food.servingSize}</p>
                    <div className="flex justify-between text-sm">
                      <span>{food.calories} cal</span>
                      <span className="text-blue-600">{food.protein}g protein</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h4 className="text-gray-500 mb-2">No foods found</h4>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Button 
                onClick={() => setIsAddFoodDialogOpen(true)} 
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Food
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-40 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : foods.length > 0 ? (
            <div className="space-y-2">
              {foods.map(food => (
                <div 
                  key={food.id} 
                  className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors duration-200"
                  onClick={() => showFoodDetails(food)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {food.imageUrl && (
                          <img 
                            src={food.imageUrl} 
                            alt={food.name} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium">{food.name}</h5>
                        <div className="text-xs text-gray-500">{food.servingSize}</div>
                      </div>
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{food.calories}</div>
                        <div className="text-xs text-gray-500">cal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{food.protein}g</div>
                        <div className="text-xs text-gray-500">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">{food.carbs}g</div>
                        <div className="text-xs text-gray-500">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{food.fat}g</div>
                        <div className="text-xs text-gray-500">fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h4 className="text-gray-500 mb-2">No foods found</h4>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Button 
                onClick={() => setIsAddFoodDialogOpen(true)} 
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Food
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
