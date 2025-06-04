
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
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
  onSaveRule: (ruleData: any) => void;
  onActivateRule: () => void;
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
        <div className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-6">
          <div className="col-span-3">
            <EventList 
              events={events}
              onSelectEvent={setSelectedEvent}
              selectedEventId={selectedEvent?.id}
            />
          </div>
          <div className="col-span-4">
            <AttributeList 
              attributes={attributes}
              onSelectAttribute={onSelectAttribute}
              selectedAttributeId={selectedAttribute?.id}
            />
          </div>
          <div className="col-span-5">
            <RuleCreationForm 
              attributes={attributes}
              events={events}
              initialRule={selectedRule ? {
                name: selectedRule.name,
                description: selectedRule.description || '',
                conditions: selectedRule.conditions
              } : undefined}
              onSaveRule={onSaveRule}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
