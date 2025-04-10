
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Bell } from 'lucide-react';
import { MatchingUser } from '@/types/leadIngestionTypes';

interface PreviewPanelProps {
  matchingUsers: MatchingUser[];
  onActivate: () => void;
  onViewAllUsers: () => void;
  onConfigureAlerts: () => void;
}

export const PreviewPanel = ({ 
  matchingUsers, 
  onActivate,
  onViewAllUsers,
  onConfigureAlerts
}: PreviewPanelProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          See matching users and rule results
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="matching" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-2 mx-4">
          <TabsTrigger value="matching">Matching Users</TabsTrigger>
          <TabsTrigger value="stats">Stats & Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matching" className="flex-1 flex flex-col mx-4 data-[state=active]:flex data-[state=inactive]:hidden">
          <div className="text-sm mb-4">
            <span className="font-semibold">{matchingUsers.length}</span> matching users found
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {matchingUsers.map(user => (
                <div key={user.id} className="p-3 border rounded-md">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    Recent Events:
                  </div>
                  <div className="space-y-1">
                    {user.recentEvents.slice(0, 3).map((event, i) => (
                      <div key={i} className="text-xs flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                        <span className="font-medium">{event.name}</span>
                        <span className="ml-auto text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {user.tags && user.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {user.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="stats" className="flex-1 mx-4 data-[state=active]:flex data-[state=inactive]:hidden flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Rule Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 text-center">
                <div className="text-2xl font-bold">{matchingUsers.length}</div>
                <div className="text-xs text-muted-foreground">Current Matches</div>
              </div>
              <div className="border rounded-md p-4 text-center">
                <div className="text-2xl font-bold">0.5%</div>
                <div className="text-xs text-muted-foreground">Of Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Match Projection</h4>
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Daily estimate</span>
                <Badge variant="outline">~{Math.round(matchingUsers.length * 7.5)}</Badge>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Weekly estimate</span>
                <Badge variant="outline">~{Math.round(matchingUsers.length * 7.5 * 7)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly estimate</span>
                <Badge variant="outline">~{Math.round(matchingUsers.length * 7.5 * 30)}</Badge>
              </div>
            </div>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mb-2"
              onClick={onConfigureAlerts}
            >
              <Bell className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onViewAllUsers}
            >
              View All Matching Users
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full"
          onClick={onActivate}
          variant="default"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Activate Rule
        </Button>
      </CardFooter>
    </Card>
  );
};
