import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuggestionProps {
  id: number;
  name: string;
  calories: number;
  protein: number;
  imageUrl: string;
}

interface MealSuggestionsProps {
  suggestions: SuggestionProps[];
  onViewMore: () => void;
  onSelectSuggestion: (suggestion: SuggestionProps) => void;
}

export function MealSuggestions({ suggestions, onViewMore, onSelectSuggestion }: MealSuggestionsProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-4">Meal Suggestions</h3>
        
        <div className="space-y-4">
          {suggestions.map(suggestion => (
            <div 
              key={suggestion.id}
              className="p-4 border border-gray-100 rounded-lg hover:border-primary cursor-pointer transition-colors duration-200"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={suggestion.imageUrl} 
                    alt={suggestion.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h5 className="font-medium">{suggestion.name}</h5>
                  <div className="flex space-x-2 text-xs mt-1">
                    <span className="text-green-600">{suggestion.calories} cal</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-blue-600">{suggestion.protein}g protein</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          variant="ghost" 
          className="w-full text-center text-sm text-[#2196F3] font-medium"
          onClick={onViewMore}
        >
          View More Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
}
