
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppSidebar from './AppSidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={0}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
