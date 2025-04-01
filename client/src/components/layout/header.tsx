import React from 'react';
import { useLocation } from 'wouter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

export function Header() {
  const [, navigate] = useLocation();
  
  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <span className="material-icons text-primary">eco</span>
        <h1 className="text-xl font-bold text-primary">SmartDiet</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-full p-2">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full p-2">
          <Settings className="h-5 w-5" />
        </Button>
        
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/profile')}
        >
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback className="text-white text-sm">JS</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">Jane Smith</span>
        </div>
      </div>
    </header>
  );
}
