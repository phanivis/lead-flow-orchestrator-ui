
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { EventList } from '@/components/lead-ingestion/EventList';
import { RuleBuilder } from '@/components/lead-ingestion/RuleBuilder';
import { PreviewPanel } from '@/components/lead-ingestion/PreviewPanel';
import { EventDefinition, QualificationRule, MatchingUser } from '@/types/leadIngestionTypes';
import { useToast } from '@/hooks/use-toast';

interface RuleBuilderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRule: QualificationRule | null;
  selectedEvent: EventDefinition | null;
  onSelectEvent: (event: EventDefinition) => void;
  events: EventDefinition[];
  matchingUsers: MatchingUser[];
  onSaveRule: (ruleData: any) => void;
  onActivateRule: () => void;
  onConfigureAlerts: () => void;
}

export const RuleBuilderSheet = ({
  open,
  onOpenChange,
  selectedRule,
  selectedEvent,
  onSelectEvent,
  events,
  matchingUsers,
  onSaveRule,
  onActivateRule,
  onConfigureAlerts
}: RuleBuilderSheetProps) => {
  const { toast } = useToast();

  return (
    <Sheet 
      open={open} 
      onOpenChange={onOpenChange}
      modal={false}
    >
      <SheetContent className="sm:max-w-none w-full p-0 overflow-hidden flex flex-col h-screen bg-background">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {selectedRule ? `Edit Rule: ${selectedRule.name}` : 'Create Lead Qualification Rule'}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-6">
          <div className="col-span-3">
            <EventList 
              events={events}
              onSelectEvent={onSelectEvent}
              selectedEventId={selectedEvent?.id}
            />
          </div>
          <div className="col-span-5">
            <RuleBuilder 
              events={events}
              initialConditions={selectedRule?.conditions}
              onSave={onSaveRule}
            />
          </div>
          <div className="col-span-4">
            <PreviewPanel 
              matchingUsers={matchingUsers}
              onActivate={onActivateRule}
              onViewAllUsers={() => {
                toast({
                  title: "View all users",
                  description: "This would open the Lead Explorer with this rule's filter applied.",
                });
              }}
              onConfigureAlerts={onConfigureAlerts}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
