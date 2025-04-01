import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertFoodSchema, 
  insertMealSchema, 
  insertDailySummarySchema,
  insertMealPlanSchema,
  insertNutritionAnalyticsSchema,
  insertRecommendationSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware for validation errors
  const validateRequest = (schema: any) => (req: Request, res: Response, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      next(error);
    }
  };

  // ===== User Routes =====
  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // ===== Food Routes =====
  app.get('/api/foods', async (req, res) => {
    try {
      const query = req.query.q as string;
      const foodGroup = req.query.group as string;
      
      let foods;
      if (query) {
        foods = await storage.searchFoods(query);
      } else if (foodGroup) {
        foods = await storage.getFoodsByGroup(foodGroup);
      } else {
        foods = await storage.getFoods();
      }
      
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch foods" });
    }
  });

  app.get('/api/foods/:id', async (req, res) => {
    try {
      const food = await storage.getFood(parseInt(req.params.id));
      if (!food) {
        return res.status(404).json({ message: "Food not found" });
      }
      res.json(food);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food" });
    }
  });

  app.post('/api/foods', validateRequest(insertFoodSchema), async (req, res) => {
    try {
      const food = await storage.createFood(req.body);
      res.status(201).json(food);
    } catch (error) {
      res.status(500).json({ message: "Failed to create food" });
    }
  });

  // ===== Meal Routes =====
  app.get('/api/meals', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const dateStr = req.query.date as string;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      let meals;
      if (dateStr) {
        const date = new Date(dateStr);
        meals = await storage.getMealsByUserAndDate(userId, date);
      } else {
        meals = await storage.getMealsByUser(userId);
      }
      
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.get('/api/meals/:id', async (req, res) => {
    try {
      const meal = await storage.getMeal(parseInt(req.params.id));
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.json(meal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meal" });
    }
  });

  app.post('/api/meals', validateRequest(insertMealSchema), async (req, res) => {
    try {
      const meal = await storage.createMeal(req.body);
      
      // Update or create daily summary
      const date = new Date(req.body.date);
      let summary = await storage.getDailySummary(req.body.userId, date);
      
      if (summary) {
        summary = await storage.updateDailySummary(summary.id, {
          totalCalories: (summary.totalCalories || 0) + meal.calories,
          totalProtein: (summary.totalProtein || 0) + meal.protein,
          totalCarbs: (summary.totalCarbs || 0) + meal.carbs,
          totalFat: (summary.totalFat || 0) + meal.fat,
          completedMeals: (summary.completedMeals || 0) + 1
        });
      } else {
        summary = await storage.createDailySummary({
          userId: req.body.userId,
          date: date.toISOString().split('T')[0],
          totalCalories: meal.calories,
          totalProtein: meal.protein,
          totalCarbs: meal.carbs,
          totalFat: meal.fat,
          completedMeals: 1,
          waterIntake: 0
        });
      }
      
      res.status(201).json({ meal, summary });
    } catch (error) {
      res.status(500).json({ message: "Failed to create meal" });
    }
  });

  app.patch('/api/meals/:id', async (req, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const updatedMeal = await storage.updateMeal(mealId, req.body);
      if (!updatedMeal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.json(updatedMeal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update meal" });
    }
  });

  app.delete('/api/meals/:id', async (req, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const meal = await storage.getMeal(mealId);
      
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      
      const success = await storage.deleteMeal(mealId);
      
      if (success) {
        // Update daily summary
        const date = new Date(meal.date);
        const summary = await storage.getDailySummary(meal.userId, date);
        
        if (summary) {
          await storage.updateDailySummary(summary.id, {
            totalCalories: (summary.totalCalories || 0) - meal.calories,
            totalProtein: (summary.totalProtein || 0) - meal.protein,
            totalCarbs: (summary.totalCarbs || 0) - meal.carbs,
            totalFat: (summary.totalFat || 0) - meal.fat,
            completedMeals: (summary.completedMeals || 0) - 1
          });
        }
        
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to delete meal" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meal" });
    }
  });

  // ===== Daily Summary Routes =====
  app.get('/api/daily-summaries', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const dateStr = req.query.date as string;
      
      if (!userId || !dateStr) {
        return res.status(400).json({ message: "userId and date are required" });
      }
      
      const date = new Date(dateStr);
      const summary = await storage.getDailySummary(userId, date);
      
      if (!summary) {
        // Return an empty summary if none exists
        return res.json({
          userId,
          date: dateStr,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          completedMeals: 0,
          waterIntake: 0
        });
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily summary" });
    }
  });

  app.post('/api/daily-summaries', validateRequest(insertDailySummarySchema), async (req, res) => {
    try {
      const date = new Date(req.body.date);
      let summary = await storage.getDailySummary(req.body.userId, date);
      
      if (summary) {
        // Update existing summary
        summary = await storage.updateDailySummary(summary.id, req.body);
      } else {
        // Create new summary
        summary = await storage.createDailySummary(req.body);
      }
      
      res.status(201).json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to create/update daily summary" });
    }
  });

  app.patch('/api/daily-summaries/:id', async (req, res) => {
    try {
      const summaryId = parseInt(req.params.id);
      const updatedSummary = await storage.updateDailySummary(summaryId, req.body);
      
      if (!updatedSummary) {
        return res.status(404).json({ message: "Daily summary not found" });
      }
      
      res.json(updatedSummary);
    } catch (error) {
      res.status(500).json({ message: "Failed to update daily summary" });
    }
  });

  // ===== Meal Plan Routes =====
  app.get('/api/meal-plans', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const active = req.query.active as string;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      let mealPlans;
      if (active === 'true') {
        const activePlan = await storage.getActiveMealPlanByUser(userId);
        mealPlans = activePlan ? [activePlan] : [];
      } else {
        mealPlans = await storage.getMealPlansByUser(userId);
      }
      
      res.json(mealPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  app.get('/api/meal-plans/:id', async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(parseInt(req.params.id));
      
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meal plan" });
    }
  });

  app.post('/api/meal-plans', validateRequest(insertMealPlanSchema), async (req, res) => {
    try {
      // If this is set to active, deactivate any other active plans for this user
      if (req.body.isActive) {
        const activePlan = await storage.getActiveMealPlanByUser(req.body.userId);
        if (activePlan) {
          await storage.updateMealPlan(activePlan.id, { isActive: false });
        }
      }
      
      const mealPlan = await storage.createMealPlan(req.body);
      res.status(201).json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to create meal plan" });
    }
  });

  app.patch('/api/meal-plans/:id', async (req, res) => {
    try {
      const mealPlanId = parseInt(req.params.id);
      const mealPlan = await storage.getMealPlan(mealPlanId);
      
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      // If setting this plan to active, deactivate any other active plans for this user
      if (req.body.isActive && !mealPlan.isActive) {
        const activePlan = await storage.getActiveMealPlanByUser(mealPlan.userId);
        if (activePlan && activePlan.id !== mealPlanId) {
          await storage.updateMealPlan(activePlan.id, { isActive: false });
        }
      }
      
      const updatedMealPlan = await storage.updateMealPlan(mealPlanId, req.body);
      res.json(updatedMealPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update meal plan" });
    }
  });

  app.delete('/api/meal-plans/:id', async (req, res) => {
    try {
      const mealPlanId = parseInt(req.params.id);
      const success = await storage.deleteMealPlan(mealPlanId);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ message: "Meal plan not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meal plan" });
    }
  });

  // ===== Nutrition Analytics Routes =====
  app.get('/api/nutrition-analytics', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const startDateStr = req.query.startDate as string;
      const endDateStr = req.query.endDate as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      // Return analytics history if no date range is specified
      if (!startDateStr || !endDateStr) {
        const history = await storage.getNutritionAnalyticsHistory(userId, limit);
        return res.json(history);
      }
      
      // Get analytics for specific date range
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const analytics = await storage.getNutritionAnalytics(userId, startDate, endDate);
      
      if (!analytics) {
        return res.json({
          userId,
          periodStart: startDateStr,
          periodEnd: endDateStr,
          avgCalories: 0,
          avgProtein: 0,
          avgCarbs: 0,
          avgFat: 0,
          caloriesTrend: 0,
          proteinTrend: 0,
          carbsTrend: 0,
          fatTrend: 0,
          targetAdherence: 0,
          mostConsumedFoods: []
        });
      }
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition analytics" });
    }
  });

  app.post('/api/nutrition-analytics', validateRequest(insertNutritionAnalyticsSchema), async (req, res) => {
    try {
      const analytics = await storage.createNutritionAnalytics(req.body);
      res.status(201).json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to create nutrition analytics" });
    }
  });

  // ===== Recommendation Routes =====
  app.get('/api/recommendations', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const type = req.query.type as string;
      const activeOnly = req.query.active === 'true';
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      let recommendations;
      if (activeOnly) {
        recommendations = await storage.getActiveRecommendations(userId);
      } else {
        recommendations = await storage.getRecommendations(userId, type);
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get('/api/recommendations/:id', async (req, res) => {
    try {
      const recommendation = await storage.getRecommendation(parseInt(req.params.id));
      
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendation" });
    }
  });

  app.post('/api/recommendations', validateRequest(insertRecommendationSchema), async (req, res) => {
    try {
      const recommendation = await storage.createRecommendation(req.body);
      res.status(201).json(recommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  app.patch('/api/recommendations/:id', async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      const updatedRecommendation = await storage.updateRecommendation(recommendationId, req.body);
      
      if (!updatedRecommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      res.json(updatedRecommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update recommendation" });
    }
  });

  app.delete('/api/recommendations/:id', async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      const success = await storage.deleteRecommendation(recommendationId);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ message: "Recommendation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recommendation" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
