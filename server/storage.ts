import {
  users, type User, type InsertUser,
  foods, type Food, type InsertFood,
  meals, type Meal, type InsertMeal,
  dailySummaries, type DailySummary, type InsertDailySummary,
  mealPlans, type MealPlan, type InsertMealPlan,
  nutritionAnalytics, type NutritionAnalytics, type InsertNutritionAnalytics,
  recommendations, type Recommendation, type InsertRecommendation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, asc } from "drizzle-orm";

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
  
  // Nutrition analytics operations
  getNutritionAnalytics(userId: number, startDate: Date, endDate: Date): Promise<NutritionAnalytics | undefined>;
  getNutritionAnalyticsHistory(userId: number, limit?: number): Promise<NutritionAnalytics[]>;
  createNutritionAnalytics(analytics: InsertNutritionAnalytics): Promise<NutritionAnalytics>;
  
  // Recommendation operations
  getRecommendations(userId: number, type?: string): Promise<Recommendation[]>;
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, recommendation: Partial<Recommendation>): Promise<Recommendation | undefined>;
  deleteRecommendation(id: number): Promise<boolean>;
  getActiveRecommendations(userId: number): Promise<Recommendation[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  // Food operations
  async getFood(id: number): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.id, id));
    return food || undefined;
  }

  async getFoods(): Promise<Food[]> {
    return db.select().from(foods);
  }

  async getFoodsByGroup(foodGroup: string): Promise<Food[]> {
    return db.select().from(foods).where(eq(foods.foodGroup, foodGroup));
  }

  async searchFoods(query: string): Promise<Food[]> {
    query = query.toLowerCase();
    return db.select().from(foods).where(
      like(foods.name, `%${query}%`)
    );
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const [food] = await db
      .insert(foods)
      .values(insertFood)
      .returning();
    return food;
  }

  // Meal operations
  async getMeal(id: number): Promise<Meal | undefined> {
    const [meal] = await db.select().from(meals).where(eq(meals.id, id));
    return meal || undefined;
  }

  async getMealsByUser(userId: number): Promise<Meal[]> {
    return db.select().from(meals).where(eq(meals.userId, userId));
  }

  async getMealsByUserAndDate(userId: number, date: Date): Promise<Meal[]> {
    const dateStr = date.toISOString().split('T')[0];
    return db.select()
      .from(meals)
      .where(
        and(
          eq(meals.userId, userId),
          eq(meals.date, dateStr)
        )
      );
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const [meal] = await db
      .insert(meals)
      .values(insertMeal)
      .returning();
    return meal;
  }

  async updateMeal(id: number, mealData: Partial<Meal>): Promise<Meal | undefined> {
    const [updatedMeal] = await db
      .update(meals)
      .set(mealData)
      .where(eq(meals.id, id))
      .returning();
    return updatedMeal || undefined;
  }

  async deleteMeal(id: number): Promise<boolean> {
    const result = await db.delete(meals).where(eq(meals.id, id));
    return true; // In PostgreSQL, successful delete doesn't return count
  }

  // Daily summary operations
  async getDailySummary(userId: number, date: Date): Promise<DailySummary | undefined> {
    const dateStr = date.toISOString().split('T')[0];
    const [summary] = await db.select()
      .from(dailySummaries)
      .where(
        and(
          eq(dailySummaries.userId, userId),
          eq(dailySummaries.date, dateStr)
        )
      );
    return summary || undefined;
  }

  async createDailySummary(insertSummary: InsertDailySummary): Promise<DailySummary> {
    const [summary] = await db
      .insert(dailySummaries)
      .values(insertSummary)
      .returning();
    return summary;
  }

  async updateDailySummary(id: number, summaryData: Partial<DailySummary>): Promise<DailySummary | undefined> {
    const [updatedSummary] = await db
      .update(dailySummaries)
      .set(summaryData)
      .where(eq(dailySummaries.id, id))
      .returning();
    return updatedSummary || undefined;
  }

  // Meal plan operations
  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    const [mealPlan] = await db.select().from(mealPlans).where(eq(mealPlans.id, id));
    return mealPlan || undefined;
  }

  async getActiveMealPlanByUser(userId: number): Promise<MealPlan | undefined> {
    const [mealPlan] = await db.select()
      .from(mealPlans)
      .where(
        and(
          eq(mealPlans.userId, userId),
          eq(mealPlans.isActive, true)
        )
      );
    return mealPlan || undefined;
  }

  async getMealPlansByUser(userId: number): Promise<MealPlan[]> {
    return db.select().from(mealPlans).where(eq(mealPlans.userId, userId));
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const [mealPlan] = await db
      .insert(mealPlans)
      .values(insertMealPlan)
      .returning();
    return mealPlan;
  }

  async updateMealPlan(id: number, mealPlanData: Partial<MealPlan>): Promise<MealPlan | undefined> {
    const [updatedMealPlan] = await db
      .update(mealPlans)
      .set(mealPlanData)
      .where(eq(mealPlans.id, id))
      .returning();
    return updatedMealPlan || undefined;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    await db.delete(mealPlans).where(eq(mealPlans.id, id));
    return true;
  }
  
  // Nutrition analytics operations
  async getNutritionAnalytics(userId: number, startDate: Date, endDate: Date): Promise<NutritionAnalytics | undefined> {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const [analytics] = await db.select()
      .from(nutritionAnalytics)
      .where(
        and(
          eq(nutritionAnalytics.userId, userId),
          eq(nutritionAnalytics.periodStart, startDateStr),
          eq(nutritionAnalytics.periodEnd, endDateStr)
        )
      );
    return analytics || undefined;
  }

  async getNutritionAnalyticsHistory(userId: number, limit: number = 10): Promise<NutritionAnalytics[]> {
    return db.select()
      .from(nutritionAnalytics)
      .where(eq(nutritionAnalytics.userId, userId))
      .orderBy(desc(nutritionAnalytics.createdAt))
      .limit(limit);
  }

  async createNutritionAnalytics(insertAnalytics: InsertNutritionAnalytics): Promise<NutritionAnalytics> {
    const [analytics] = await db
      .insert(nutritionAnalytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  // Recommendation operations
  async getRecommendations(userId: number, type?: string): Promise<Recommendation[]> {
    const query = db.select().from(recommendations);
    
    if (type) {
      return query
        .where(and(
          eq(recommendations.userId, userId),
          eq(recommendations.type, type)
        ))
        .orderBy(desc(recommendations.priority), desc(recommendations.createdAt));
    } else {
      return query
        .where(eq(recommendations.userId, userId))
        .orderBy(desc(recommendations.priority), desc(recommendations.createdAt));
    }
  }

  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    const [recommendation] = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return recommendation || undefined;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(recommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async updateRecommendation(id: number, recommendationData: Partial<Recommendation>): Promise<Recommendation | undefined> {
    const [updatedRecommendation] = await db
      .update(recommendations)
      .set(recommendationData)
      .where(eq(recommendations.id, id))
      .returning();
    return updatedRecommendation || undefined;
  }

  async deleteRecommendation(id: number): Promise<boolean> {
    await db.delete(recommendations).where(eq(recommendations.id, id));
    return true;
  }

  async getActiveRecommendations(userId: number): Promise<Recommendation[]> {
    const query = db.select().from(recommendations);
    return query
      .where(and(
        eq(recommendations.userId, userId),
        eq(recommendations.isActive, true)
      ))
      .orderBy(desc(recommendations.priority), desc(recommendations.createdAt));
  }
}

// Initialize the database with some default foods
async function initializeFoodDatabase() {
  const count = await db.select().from(foods).limit(1);
  
  // If we already have foods in the database, don't add more
  if (count.length > 0) {
    return;
  }
  
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

  // Add default foods to the database
  for (const food of defaultFoods) {
    await db.insert(foods).values(food);
  }
}

// Initialize food database and export storage
initializeFoodDatabase().catch(console.error);

export const storage = new DatabaseStorage();
