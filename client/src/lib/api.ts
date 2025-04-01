import { apiRequest } from './queryClient';

// User API
export const fetchUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const createUser = async (userData: any) => {
  return apiRequest('POST', '/api/users', userData);
};

export const updateUser = async (id: number, userData: any) => {
  return apiRequest('PATCH', `/api/users/${id}`, userData);
};

// Food API
export const fetchFoods = async (query?: string, foodGroup?: string) => {
  let url = '/api/foods';
  if (query || foodGroup) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (foodGroup) params.append('group', foodGroup);
    url += `?${params.toString()}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch foods');
  return res.json();
};

export const fetchFood = async (id: number) => {
  const res = await fetch(`/api/foods/${id}`);
  if (!res.ok) throw new Error('Failed to fetch food');
  return res.json();
};

export const createFood = async (foodData: any) => {
  return apiRequest('POST', '/api/foods', foodData);
};

// Meal API
export const fetchMeals = async (userId: number, date?: string) => {
  let url = `/api/meals?userId=${userId}`;
  if (date) url += `&date=${date}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch meals');
  return res.json();
};

export const fetchMeal = async (id: number) => {
  const res = await fetch(`/api/meals/${id}`);
  if (!res.ok) throw new Error('Failed to fetch meal');
  return res.json();
};

export const createMeal = async (mealData: any) => {
  return apiRequest('POST', '/api/meals', mealData);
};

export const updateMeal = async (id: number, mealData: any) => {
  return apiRequest('PATCH', `/api/meals/${id}`, mealData);
};

export const deleteMeal = async (id: number) => {
  return apiRequest('DELETE', `/api/meals/${id}`);
};

// Daily Summary API
export const fetchDailySummary = async (userId: number, date: string) => {
  const res = await fetch(`/api/daily-summaries?userId=${userId}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch daily summary');
  return res.json();
};

export const createOrUpdateDailySummary = async (summaryData: any) => {
  return apiRequest('POST', '/api/daily-summaries', summaryData);
};

// Meal Plan API
export const fetchMealPlans = async (userId: number, active?: boolean) => {
  let url = `/api/meal-plans?userId=${userId}`;
  if (active !== undefined) url += `&active=${active}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch meal plans');
  return res.json();
};

export const fetchMealPlan = async (id: number) => {
  const res = await fetch(`/api/meal-plans/${id}`);
  if (!res.ok) throw new Error('Failed to fetch meal plan');
  return res.json();
};

export const createMealPlan = async (mealPlanData: any) => {
  return apiRequest('POST', '/api/meal-plans', mealPlanData);
};

export const updateMealPlan = async (id: number, mealPlanData: any) => {
  return apiRequest('PATCH', `/api/meal-plans/${id}`, mealPlanData);
};

export const deleteMealPlan = async (id: number) => {
  return apiRequest('DELETE', `/api/meal-plans/${id}`);
};
