import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentSection: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export function MobileNav({ currentSection }: MobileNavProps) {
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Meals', path: '/meal-planner', icon: 'restaurant_menu' },
    { label: 'Nutrition', path: '/nutrition-tracker', icon: 'monitor_weight' },
    { label: 'Profile', path: '/profile', icon: 'person' }
  ];

  return (
    <div className="md:hidden flex items-center justify-around bg-white border-t border-gray-200 py-2">
      {navItems.map((item) => {
        const isActive = 
          (item.path === '/' && currentSection === 'dashboard') || 
          (item.path !== '/' && item.path.includes(currentSection));
        
        return (
          <Link key={item.path} href={item.path}>
            <a 
              className={cn(
                "p-2 rounded-full flex flex-col items-center",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
