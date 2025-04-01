import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CircularProgress } from '@/components/ui/circular-progress';
import { User, Settings, Bell, Shield, LineChart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { toast } = useToast();
  
  // Mock data for profile (in a real app, this would come from API)
  const [profileData, setProfileData] = useState({
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
    calorieTarget: 2000,
    proteinTarget: 90,
    carbsTarget: 250,
    fatTarget: 67,
    dietType: 'balanced',
    allergens: ['peanuts', 'shellfish'],
  });
  
  const dietTypes = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'keto', label: 'Ketogenic' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
  ];
  
  const allergenOptions = [
    'peanuts', 'tree nuts', 'dairy', 'eggs', 'wheat', 'soy', 'fish', 'shellfish'
  ];
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  const handleDietTypeChange = (value: string) => {
    setProfileData(prev => ({ ...prev, dietType: value }));
  };
  
  const toggleAllergen = (allergen: string) => {
    setProfileData(prev => {
      const allergens = [...prev.allergens];
      if (allergens.includes(allergen)) {
        return { ...prev, allergens: allergens.filter(a => a !== allergen) };
      } else {
        return { ...prev, allergens: [...allergens, allergen] };
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNutrientChange = (name: string, value: number[]) => {
    setProfileData(prev => ({ ...prev, [name]: value[0] }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 bg-primary">
                  <AvatarFallback className="text-white text-xl">JS</AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-gray-500 mb-4">@{profileData.username}</p>
                
                <Button variant="outline" className="mb-6 w-full">Change Avatar</Button>
                
                <div className="w-full space-y-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm">Account</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm">Preferences</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm">Notifications</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm">Privacy</span>
                  </div>
                  
                  <div className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm">Progress</span>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="diet">Diet Preferences</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        name="firstName" 
                        value={profileData.firstName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        name="lastName" 
                        value={profileData.lastName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input 
                      name="username" 
                      value={profileData.username} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" value="********" disabled />
                    <p className="text-xs text-gray-500">Password last changed 3 months ago</p>
                  </div>
                  
                  <Button 
                    className="bg-primary hover:bg-primary/90 mt-4"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </TabsContent>
                
                <TabsContent value="diet" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diet Type</label>
                    <Select 
                      value={profileData.dietType} 
                      onValueChange={handleDietTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dietTypes.map(diet => (
                          <SelectItem key={diet.value} value={diet.value}>
                            {diet.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Food Allergies & Intolerances</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allergenOptions.map(allergen => (
                        <Badge
                          key={allergen}
                          variant={profileData.allergens.includes(allergen) ? "default" : "outline"}
                          className={`cursor-pointer capitalize ${
                            profileData.allergens.includes(allergen) 
                              ? "bg-primary hover:bg-primary/90" 
                              : ""
                          }`}
                          onClick={() => toggleAllergen(allergen)}
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Meal Reminders</span>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Hide Foods I'm Allergic To</span>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Suggest Foods Based on Diet Type</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-primary hover:bg-primary/90 mt-4"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </TabsContent>
                
                <TabsContent value="nutrition" className="space-y-8">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Nutrition Targets</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Set your daily nutrition targets based on your health goals.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          value={profileData.calorieTarget}
                          max={3000}
                          size={70}
                          color="primary"
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-500">Calories</div>
                          <div className="text-sm font-medium">{profileData.calorieTarget}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          value={profileData.proteinTarget}
                          max={150}
                          size={70}
                          color="secondary"
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-500">Protein (g)</div>
                          <div className="text-sm font-medium">{profileData.proteinTarget}g</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          value={profileData.carbsTarget}
                          max={400}
                          size={70}
                          color="accent"
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-500">Carbs (g)</div>
                          <div className="text-sm font-medium">{profileData.carbsTarget}g</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          value={profileData.fatTarget}
                          max={100}
                          size={70}
                          color="destructive"
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-500">Fat (g)</div>
                          <div className="text-sm font-medium">{profileData.fatTarget}g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Daily Calories</label>
                        <span className="text-sm font-medium">{profileData.calorieTarget} kcal</span>
                      </div>
                      <Slider 
                        value={[profileData.calorieTarget]} 
                        min={1200} 
                        max={3000} 
                        step={50} 
                        onValueChange={(value) => handleNutrientChange('calorieTarget', value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Protein Target</label>
                        <span className="text-sm font-medium">{profileData.proteinTarget}g</span>
                      </div>
                      <Slider 
                        value={[profileData.proteinTarget]} 
                        min={30} 
                        max={150} 
                        step={5} 
                        onValueChange={(value) => handleNutrientChange('proteinTarget', value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Carbohydrates Target</label>
                        <span className="text-sm font-medium">{profileData.carbsTarget}g</span>
                      </div>
                      <Slider 
                        value={[profileData.carbsTarget]} 
                        min={50} 
                        max={400} 
                        step={10} 
                        onValueChange={(value) => handleNutrientChange('carbsTarget', value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Fat Target</label>
                        <span className="text-sm font-medium">{profileData.fatTarget}g</span>
                      </div>
                      <Slider 
                        value={[profileData.fatTarget]} 
                        min={20} 
                        max={100} 
                        step={5} 
                        onValueChange={(value) => handleNutrientChange('fatTarget', value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-primary hover:bg-primary/90 mt-4"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
