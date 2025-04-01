import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentSection: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export function Sidebar({ currentSection }: SidebarProps) {
  const [, navigate] = useLocation();
  
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Meal Planner', path: '/meal-planner', icon: 'restaurant_menu' },
    { label: 'Nutrition Tracker', path: '/nutrition-tracker', icon: 'monitor_weight' },
    { label: 'Food Database', path: '/food-database', icon: 'search' },
    { label: 'Profile', path: '/profile', icon: 'person' }
  ];

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = 
              (item.path === '/' && currentSection === 'dashboard') || 
              (item.path !== '/' && item.path.includes(currentSection));
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg",
                      isActive 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <span className="material-icons">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
