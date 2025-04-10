
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { EventDefinition } from '@/types/leadIngestionTypes';
import { cn } from '@/lib/utils';

interface EventListProps {
  events: EventDefinition[];
  onSelectEvent: (event: EventDefinition) => void;
  selectedEventId?: string;
}

export const EventList = ({ events, onSelectEvent, selectedEventId }: EventListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Available Events</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No events found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEvents.map(event => (
                <div 
                  key={event.id}
                  className={cn(
                    "p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                    selectedEventId === event.id && "bg-muted"
                  )}
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="font-medium">{event.name}</div>
                  {event.description && (
                    <div className="text-sm text-muted-foreground mt-1">{event.description}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {event.properties.length} {event.properties.length === 1 ? 'property' : 'properties'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
