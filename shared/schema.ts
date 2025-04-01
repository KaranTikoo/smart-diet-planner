import { pgTable, text, serial, integer, timestamp, date, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  calorieTarget: integer("calorie_target").default(2000),
  proteinTarget: integer("protein_target").default(100),
  carbsTarget: integer("carbs_target").default(250),
  fatTarget: integer("fat_target").default(67),
  dietType: text("diet_type").default("balanced"),
  allergens: text("allergens").array(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

// Food model
export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  servingSize: text("serving_size").notNull(),
  foodGroup: text("food_group").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true
});

// Meal model
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // breakfast, lunch, dinner, snack
  date: date("date").notNull(),
  time: text("time").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  foods: json("foods").notNull(), // Array of food items with quantities
  imageUrl: text("image_url"),
  description: text("description"),
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true
});

// Daily summary model for nutrition tracking
export const dailySummaries = pgTable("daily_summaries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  totalCalories: integer("total_calories").default(0),
  totalProtein: integer("total_protein").default(0),
  totalCarbs: integer("total_carbs").default(0),
  totalFat: integer("total_fat").default(0),
  completedMeals: integer("completed_meals").default(0),
  waterIntake: integer("water_intake").default(0),
});

export const insertDailySummarySchema = createInsertSchema(dailySummaries).omit({
  id: true
});

// Meal plan model
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  meals: json("meals").notNull(), // Array of meal IDs organized by day and meal type
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;

export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;

export type DailySummary = typeof dailySummaries.$inferSelect;
export type InsertDailySummary = z.infer<typeof insertDailySummarySchema>;

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
