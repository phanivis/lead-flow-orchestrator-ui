
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, HelpCircle, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const location = useLocation();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  
  // Sample notifications
  const notifications = [
    { id: 1, type: 'success', title: 'Lead Import Complete', message: 'Successfully imported 245 leads', time: '10 min ago', icon: CheckCircle2 },
    { id: 2, type: 'warning', title: 'Duplicate Leads', message: '15 duplicate leads detected', time: '1 hour ago', icon: AlertTriangle },
    { id: 3, type: 'info', title: 'System Update', message: 'New scoring rules available', time: '3 hours ago', icon: Info },
  ];
  
  // Map routes to page titles
  const getTitleFromPath = (path: string) => {
    const routeTitles: Record<string, string> = {
      '/upload': 'Upload Leads to LMS',
      '/field-mapping': 'Field Mapping',
      '/scoring-rules': 'Lead Scoring Engine',
      '/cdp-attributes': 'CDP Attribute Selector',
      '/bulk-edit': 'Bulk Tag/Property Editor',
      '/ingestion-history': 'Ingestion Job Dashboard',
      '/lead-explorer': 'Lead Explorer'
    };
    
    return routeTitles[path] || 'Lead Management System';
  };

  const handleNotificationsOpen = () => {
    setHasUnreadNotifications(false);
  };

  return (
    <header className="h-16 px-6 border-b bg-white flex items-center justify-between">
      <h1 className="text-xl font-medium">{getTitleFromPath(location.pathname)}</h1>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu onOpenChange={handleNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {hasUnreadNotifications && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2 cursor-pointer">
                    <div className="flex w-full">
                      <div className="mr-2 mt-0.5">
                        <notification.icon className={`h-4 w-4 ${
                          notification.type === 'success' ? 'text-green-500' : 
                          notification.type === 'warning' ? 'text-amber-500' : 
                          'text-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between w-full">
                          <span className="font-medium text-sm">{notification.title}</span>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm text-blue-600">
                  View all notifications
                </DropdownMenuItem>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
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
