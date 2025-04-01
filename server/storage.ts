import {
  users, type User, type InsertUser,
  foods, type Food, type InsertFood,
  meals, type Meal, type InsertMeal,
  dailySummaries, type DailySummary, type InsertDailySummary,
  mealPlans, type MealPlan, type InsertMealPlan
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Food operations
  getFood(id: number): Promise<Food | undefined>;
  getFoods(): Promise<Food[]>;
  getFoodsByGroup(foodGroup: string): Promise<Food[]>;
  searchFoods(query: string): Promise<Food[]>;
  createFood(food: InsertFood): Promise<Food>;
  
  // Meal operations
  getMeal(id: number): Promise<Meal | undefined>;
  getMealsByUser(userId: number): Promise<Meal[]>;
  getMealsByUserAndDate(userId: number, date: Date): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: number, meal: Partial<Meal>): Promise<Meal | undefined>;
  deleteMeal(id: number): Promise<boolean>;
  
  // Daily summary operations
  getDailySummary(userId: number, date: Date): Promise<DailySummary | undefined>;
  createDailySummary(summary: InsertDailySummary): Promise<DailySummary>;
  updateDailySummary(id: number, summary: Partial<DailySummary>): Promise<DailySummary | undefined>;
  
  // Meal plan operations
  getMealPlan(id: number): Promise<MealPlan | undefined>;
  getActiveMealPlanByUser(userId: number): Promise<MealPlan | undefined>;
  getMealPlansByUser(userId: number): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: number, mealPlan: Partial<MealPlan>): Promise<MealPlan | undefined>;
  deleteMealPlan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foods: Map<number, Food>;
  private meals: Map<number, Meal>;
  private dailySummaries: Map<number, DailySummary>;
  private mealPlans: Map<number, MealPlan>;
  
  private userCurrentId: number;
  private foodCurrentId: number;
  private mealCurrentId: number;
  private dailySummaryCurrentId: number;
  private mealPlanCurrentId: number;

  constructor() {
    this.users = new Map();
    this.foods = new Map();
    this.meals = new Map();
    this.dailySummaries = new Map();
    this.mealPlans = new Map();
    
    this.userCurrentId = 1;
    this.foodCurrentId = 1;
    this.mealCurrentId = 1;
    this.dailySummaryCurrentId = 1;
    this.mealPlanCurrentId = 1;
    
    // Add some default foods
    this.initializeFoodDatabase();
  }

  // Initialize with some common foods
  private initializeFoodDatabase() {
    const defaultFoods: InsertFood[] = [
      {
        name: 'Greek Yogurt',
        calories: 100,
        protein: 10,
        carbs: 4,
        fat: 5,
        servingSize: '1 cup (170g)',
        foodGroup: 'dairy',
        description: 'Creamy, high-protein yogurt',
        imageUrl: 'https://images.unsplash.com/photo-1494968869404-4be0e2a1cece?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8eW9ndXJ0fHx8fHx8MTcyMzA1NDc3Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3,
        servingSize: '3 oz (85g)',
        foodGroup: 'protein',
        description: 'Lean protein source',
        imageUrl: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hpY2tlbiBicmVhc3R8fHx8fHwxNzIzMDU0ODQw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Salmon',
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13,
        servingSize: '3 oz (85g)',
        foodGroup: 'protein',
        description: 'Rich in omega-3 fatty acids',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8c2FsbW9ufHx8fHx8MTcyMzA1NDg4NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Quinoa',
        calories: 222,
        protein: 8,
        carbs: 39,
        fat: 4,
        servingSize: '1 cup cooked (185g)',
        foodGroup: 'grains',
        description: 'Complete protein grain',
        imageUrl: 'https://images.unsplash.com/photo-1593309404822-e3e9e3e118e7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8cXVpbm9hfHx8fHx8MTcyMzA1NDkzOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Avocado',
        calories: 234,
        protein: 3,
        carbs: 12,
        fat: 21,
        servingSize: '1 medium (150g)',
        foodGroup: 'fruits',
        description: 'Rich in healthy fats',
        imageUrl: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8YXZvY2Fkb3x8fHx8fDE3MjMwNTQ5NzY&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Blueberries',
        calories: 85,
        protein: 1,
        carbs: 21,
        fat: 0,
        servingSize: '1 cup (150g)',
        foodGroup: 'fruits',
        description: 'Antioxidant-rich berries',
        imageUrl: 'https://images.unsplash.com/photo-1611579507504-befdb44620b2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Ymx1ZWJlcnJpZXN8fHx8fHwxNzIzMDU1MDAw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Spinach',
        calories: 23,
        protein: 3,
        carbs: 4,
        fat: 0,
        servingSize: '2 cups (60g)',
        foodGroup: 'vegetables',
        description: 'Nutrient-dense leafy green',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8c3BpbmFjaHx8fHx8fDE3MjMwNTUwMjM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Sweet Potato',
        calories: 112,
        protein: 2,
        carbs: 26,
        fat: 0,
        servingSize: '1 medium (130g)',
        foodGroup: 'vegetables',
        description: 'Nutritious starchy vegetable',
        imageUrl: 'https://images.unsplash.com/photo-1596097635121-14a693806ecb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8c3dlZXQgcG90YXRvfHx8fHx8MTcyMzA1NTA0NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Almonds',
        calories: 170,
        protein: 6,
        carbs: 6,
        fat: 15,
        servingSize: '1/4 cup (30g)',
        foodGroup: 'nuts',
        description: 'Crunchy nutrient-rich nuts',
        imageUrl: 'https://images.unsplash.com/photo-1611078375243-31ddc6484403?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8YWxtb25kfHx8fHx8MTcyMzA1NTA3Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      },
      {
        name: 'Oatmeal',
        calories: 158,
        protein: 6,
        carbs: 27,
        fat: 3,
        servingSize: '1 cup cooked (240g)',
        foodGroup: 'grains',
        description: 'Hearty whole grain breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8b2F0bWVhbHx8fHx8fDE3MjMwNTUwOTQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300'
      }
    ];

    defaultFoods.forEach(food => {
      this.createFood(food);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Food operations
  async getFood(id: number): Promise<Food | undefined> {
    return this.foods.get(id);
  }

  async getFoods(): Promise<Food[]> {
    return Array.from(this.foods.values());
  }

  async getFoodsByGroup(foodGroup: string): Promise<Food[]> {
    return Array.from(this.foods.values()).filter(
      (food) => food.foodGroup === foodGroup
    );
  }

  async searchFoods(query: string): Promise<Food[]> {
    query = query.toLowerCase();
    return Array.from(this.foods.values()).filter(
      (food) => food.name.toLowerCase().includes(query) || 
                food.description?.toLowerCase().includes(query) ||
                food.foodGroup.toLowerCase().includes(query)
    );
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const id = this.foodCurrentId++;
    const food: Food = { ...insertFood, id };
    this.foods.set(id, food);
    return food;
  }

  // Meal operations
  async getMeal(id: number): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async getMealsByUser(userId: number): Promise<Meal[]> {
    return Array.from(this.meals.values()).filter(
      (meal) => meal.userId === userId
    );
  }

  async getMealsByUserAndDate(userId: number, date: Date): Promise<Meal[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.meals.values()).filter(
      (meal) => meal.userId === userId && meal.date.toString() === dateString
    );
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = this.mealCurrentId++;
    const meal: Meal = { ...insertMeal, id };
    this.meals.set(id, meal);
    return meal;
  }

  async updateMeal(id: number, mealData: Partial<Meal>): Promise<Meal | undefined> {
    const meal = await this.getMeal(id);
    if (!meal) return undefined;

    const updatedMeal = { ...meal, ...mealData };
    this.meals.set(id, updatedMeal);
    return updatedMeal;
  }

  async deleteMeal(id: number): Promise<boolean> {
    return this.meals.delete(id);
  }

  // Daily summary operations
  async getDailySummary(userId: number, date: Date): Promise<DailySummary | undefined> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.dailySummaries.values()).find(
      (summary) => summary.userId === userId && summary.date.toString() === dateString
    );
  }

  async createDailySummary(insertSummary: InsertDailySummary): Promise<DailySummary> {
    const id = this.dailySummaryCurrentId++;
    const summary: DailySummary = { ...insertSummary, id };
    this.dailySummaries.set(id, summary);
    return summary;
  }

  async updateDailySummary(id: number, summaryData: Partial<DailySummary>): Promise<DailySummary | undefined> {
    const summary = this.dailySummaries.get(id);
    if (!summary) return undefined;

    const updatedSummary = { ...summary, ...summaryData };
    this.dailySummaries.set(id, updatedSummary);
    return updatedSummary;
  }

  // Meal plan operations
  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async getActiveMealPlanByUser(userId: number): Promise<MealPlan | undefined> {
    return Array.from(this.mealPlans.values()).find(
      (plan) => plan.userId === userId && plan.isActive
    );
  }

  async getMealPlansByUser(userId: number): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = this.mealPlanCurrentId++;
    const mealPlan: MealPlan = { ...insertMealPlan, id };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  async updateMealPlan(id: number, mealPlanData: Partial<MealPlan>): Promise<MealPlan | undefined> {
    const mealPlan = await this.getMealPlan(id);
    if (!mealPlan) return undefined;

    const updatedMealPlan = { ...mealPlan, ...mealPlanData };
    this.mealPlans.set(id, updatedMealPlan);
    return updatedMealPlan;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    return this.mealPlans.delete(id);
  }
}

export const storage = new MemStorage();
