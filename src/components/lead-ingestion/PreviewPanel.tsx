
import React from 'react';
import { Button } from '@/components/ui/button';
import { MatchingUser } from '@/types/leadIngestionTypes';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Check, Users, ChevronRight, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTimeAgo } from '@/data/leadIngestionData';

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
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-lg flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            See matching users based on your rule conditions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-lg font-semibold">
            {matchingUsers.length > 0 ? matchingUsers.length.toLocaleString() : 0} matching users
          </span>
        </div>
      </div>
      
      <div className="relative flex-1 mb-4">
        <ScrollArea className="h-[calc(100%-2rem)]">
          {matchingUsers.length === 0 ? (
            <div className="text-center py-12 h-full flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2">No matching users found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your rule conditions to match more users
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Recent Events</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchingUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {user.recentEvents.slice(0, 2).map((event, index) => (
                          <div key={index} className="text-sm flex items-center">
                            <span className="text-muted-foreground">{event.name}</span>
                            <span className="mx-1 text-muted-foreground">•</span>
                            <span className="text-xs">{getTimeAgo(event.timestamp)}</span>
                          </div>
                        ))}
                        {user.recentEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{user.recentEvents.length - 2} more events
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.score !== undefined && (
                        <Badge variant={user.score > 70 ? "success" : "secondary"}>
                          {user.score}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>
      
      <div className="space-y-2 mt-auto">
        {matchingUsers.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={onViewAllUsers}
          >
            View All Matching Users
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          className="w-full justify-between"
          onClick={onConfigureAlerts}
          disabled={matchingUsers.length === 0}
        >
          Configure Alerts
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button 
          className="w-full"
          variant="success"
          onClick={onActivate}
          disabled={matchingUsers.length === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Activate Rule
        </Button>
      </div>
    </div>
  );
};
