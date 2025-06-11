
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttributeList } from '@/components/lead-ingestion/AttributeList';
import { EventList } from '@/components/lead-ingestion/EventList';
import { RuleCreationForm } from '@/components/lead-ingestion/RuleCreationForm';
import { AttributeDefinition, QualificationRule, EventDefinition } from '@/types/leadIngestionTypes';

interface RuleBuilderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRule: QualificationRule | null;
  selectedAttribute: AttributeDefinition | null;
  onSelectAttribute: (attribute: AttributeDefinition) => void;
  attributes: AttributeDefinition[];
  events: EventDefinition[];
  onSaveRule: (ruleData: any, selectedRule: QualificationRule | null) => void;
  onActivateRule: (selectedRule: QualificationRule | null) => void;
  onConfigureAlerts: () => void;
}

export const RuleBuilderSheet = ({
  open,
  onOpenChange,
  selectedRule,
  selectedAttribute,
  onSelectAttribute,
  attributes,
  events,
  onSaveRule,
  onActivateRule,
  onConfigureAlerts
}: RuleBuilderSheetProps) => {
  const [selectedEvent, setSelectedEvent] = React.useState<EventDefinition | null>(null);

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
        
        <div className="flex-1 overflow-hidden p-6">
          <Tabs defaultValue="rule-config" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rule-config">Rule Configuration</TabsTrigger>
              <TabsTrigger value="events">Available Events</TabsTrigger>
              <TabsTrigger value="attributes">Available Attributes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rule-config" className="flex-1 overflow-hidden">
              <RuleCreationForm 
                selectedRule={selectedRule}
                attributes={attributes}
                events={events}
                onSaveRule={onSaveRule}
                onActivateRule={onActivateRule}
                onConfigureAlerts={onConfigureAlerts}
              />
            </TabsContent>
            
            <TabsContent value="events" className="flex-1 overflow-hidden">
              <EventList 
                events={events}
                onSelectEvent={setSelectedEvent}
                selectedEventId={selectedEvent?.id}
              />
            </TabsContent>
            
            <TabsContent value="attributes" className="flex-1 overflow-hidden">
              <AttributeList 
                attributes={attributes}
                onSelectAttribute={onSelectAttribute}
                selectedAttributeId={selectedAttribute?.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
