import React from 'react';
import { PlusCircle, ShoppingCart, Utensils, BarChart3 } from 'lucide-react';

interface QuickActionProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onLogFood: () => void;
  onShoppingList: () => void;
  onRecipeSearch: () => void;
  onNutritionReport: () => void;
}

function QuickAction({ icon, iconBgColor, iconColor, title, subtitle, onClick }: QuickActionProps) {
  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm flex items-center cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${iconBgColor}`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function QuickActions({ 
  onLogFood, 
  onShoppingList, 
  onRecipeSearch, 
  onNutritionReport 
}: QuickActionsProps) {
  const actions = [
    {
      icon: <PlusCircle className="h-5 w-5 text-[#2196F3]" />,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-[#2196F3]',
      title: 'Log Food',
      subtitle: 'Track your meals',
      onClick: onLogFood
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-[#FF9800]" />,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-[#FF9800]',
      title: 'Shopping List',
      subtitle: '8 items needed',
      onClick: onShoppingList
    },
    {
      icon: <Utensils className="h-5 w-5 text-[#4CAF50]" />,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-[#4CAF50]',
      title: 'Recipe Search',
      subtitle: 'Find new meals',
      onClick: onRecipeSearch
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
      title: 'Nutrition Report',
      subtitle: 'Weekly summary',
      onClick: onNutritionReport
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <QuickAction key={index} {...action} />
      ))}
    </div>
  );
}
