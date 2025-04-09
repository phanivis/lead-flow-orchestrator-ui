
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Upload, 
  Shuffle, 
  Star, 
  Database, 
  Edit2, 
  List, 
  Search,
  BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger 
} from '@/components/ui/sidebar';

const navigationItems = [
  { name: 'Lead Explorer', path: '/lead-explorer', icon: Search },
  { name: 'Upload Leads', path: '/upload', icon: Upload },
  { name: 'Field Mapping', path: '/field-mapping', icon: Shuffle },
  { name: 'Scoring Rules', path: '/scoring-rules', icon: Star },
  { name: 'CDP Attributes', path: '/cdp-attributes', icon: Database },
  { name: 'Bulk Edit', path: '/bulk-edit', icon: Edit2 },
  { name: 'Ingestion History', path: '/ingestion-history', icon: List }
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-bold">Lead Management</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    cn("flex items-center gap-3 w-full", isActive && "bg-sidebar-accent")
                  }
                >
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
            <span>Lead Management System v1.0</span>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
