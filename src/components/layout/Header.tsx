
import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, HelpCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  
  // Map routes to page titles
  const getTitleFromPath = (path: string) => {
    const routeTitles: Record<string, string> = {
      '/upload': 'Upload Leads to LMS',
      '/field-mapping': 'Field Mapping',
      '/scoring-rules': 'Lead Scoring Engine',
      '/cdp-attributes': 'CDP Attribute Selector',
      '/bulk-edit': 'Bulk Tag/Property Editor',
      '/ingestion-history': 'Ingestion Job Dashboard',
      '/alerts': 'Alerts & Monitoring',
      '/lead-explorer': 'Lead Explorer'
    };
    
    return routeTitles[path] || 'Lead Management System';
  };

  return (
    <header className="h-16 px-6 border-b bg-white flex items-center justify-between">
      <h1 className="text-xl font-medium">{getTitleFromPath(location.pathname)}</h1>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
