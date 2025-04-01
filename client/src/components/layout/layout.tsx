import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Extract the current section from the path
  const currentSection = location.split('/')[1] || 'dashboard';
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentSection={currentSection} />
        
        <main className="flex-1 overflow-auto bg-[#FAFAFA]">
          {children}
        </main>
      </div>
      
      <MobileNav currentSection={currentSection} />
    </div>
  );
}
