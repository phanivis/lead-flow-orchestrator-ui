import React from 'react';
import { NavLink } from 'react-router-dom';
import { Upload, Star, List, Search, BarChart2, Activity, Users, Database, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    name: 'Lead Explorer',
    path: '/lead-explorer',
    icon: Search
  },
  {
    name: 'Upload Leads',
    path: '/upload',
    icon: Upload
  },
  {
    name: 'Scoring Rules',
    path: '/scoring-rules',
    icon: Star
  },
  {
    name: 'Lead Qualification Rules',
    path: '/lead-ingestion',
    icon: Filter
  },
  {
    name: 'Manage Lead Attributes',
    path: '/cdp-attributes',
    icon: Database
  },
  {
    name: 'Lead Assignment',
    path: '/lead-assignment',
    icon: Users
  },
  {
    name: 'Ingestion History',
    path: '/ingestion-history',
    icon: List
  },
  {
    name: 'Lead Analytics',
    path: '/lead-analytics',
    icon: Activity
  }
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-primary" />
          <h1 className={cn("text-lg font-bold transition-opacity", isCollapsed && "opacity-0")}>Acko Lead Hub</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map(item => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <NavLink to={item.path} className={({isActive}) => cn("flex items-center gap-3 w-full", isActive && "bg-sidebar-accent")}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/70">
          <div className="flex items-center justify-between">
            <span className={cn("transition-opacity", isCollapsed && "opacity-0")}>Lead Management System v1.0</span>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
