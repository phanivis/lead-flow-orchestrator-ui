
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AttributeList } from '@/components/lead-ingestion/AttributeList';
import { RuleBuilder } from '@/components/lead-ingestion/RuleBuilder';
import { PreviewPanel } from '@/components/lead-ingestion/PreviewPanel';
import { AttributeDefinition, QualificationRule, MatchingUser } from '@/types/leadIngestionTypes';
import { useToast } from '@/hooks/use-toast';

interface RuleBuilderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRule: QualificationRule | null;
  selectedAttribute: AttributeDefinition | null;
  onSelectAttribute: (attribute: AttributeDefinition) => void;
  attributes: AttributeDefinition[];
  matchingUsers: MatchingUser[];
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
            <AttributeList 
              attributes={attributes}
              onSelectAttribute={onSelectAttribute}
              selectedAttributeId={selectedAttribute?.id}
            />
          </div>
          <div className="col-span-5">
            <RuleBuilder 
              attributes={attributes}
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
