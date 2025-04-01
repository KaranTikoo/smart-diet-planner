import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import MealPlanner from "@/pages/meal-planner";
import NutritionTracker from "@/pages/nutrition-tracker";
import FoodDatabase from "@/pages/food-database";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/meal-planner" component={MealPlanner} />
        <Route path="/nutrition-tracker" component={NutritionTracker} />
        <Route path="/food-database" component={FoodDatabase} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
