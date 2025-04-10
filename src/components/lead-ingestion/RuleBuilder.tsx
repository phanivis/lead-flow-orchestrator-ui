
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import { RuleCondition, EventDefinition } from '@/types/leadIngestionTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RuleTagsSection } from './RuleTagsSection';
import { RuleConditionsSection } from './RuleConditionsSection';

interface RuleBuilderProps {
  events: EventDefinition[];
  initialConditions?: RuleCondition[];
  onSave: (rule: {
    name: string;
    description: string;
    tags: string[];
    conditions: RuleCondition[];
  }) => void;
}

export const RuleBuilder = ({ events, initialConditions = [], onSave }: RuleBuilderProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [conditions, setConditions] = useState<RuleCondition[]>(initialConditions);
  const [isOpen, setIsOpen] = useState(true);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddCondition = () => {
    if (events.length === 0) return;
    
    const newCondition: RuleCondition = {
      id: `condition-${Date.now()}`,
      eventName: events[0].name,
      operator: 'exists',
    };
    
    setConditions(prev => [...prev, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const handleUpdateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setConditions(prev => 
      prev.map(condition => 
        condition.id === id ? { ...condition, ...updates } : condition
      )
    );
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      tags,
      conditions,
    });
  };

  return (
    <div className="border rounded-lg p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div>
          <Label htmlFor="rule-name">Rule Name</Label>
          <Input 
            id="rule-name" 
            placeholder="Enter rule name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="rule-description">Description</Label>
          <Textarea 
            id="rule-description" 
            placeholder="Enter rule description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <RuleTagsSection
          tags={tags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
        />
      </div>
      
      <div className="mt-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Rule Conditions</Label>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              <RuleConditionsSection
                conditions={conditions}
                events={events}
                onAddCondition={handleAddCondition}
                onRemoveCondition={handleRemoveCondition}
                onUpdateCondition={handleUpdateCondition}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="mt-auto pt-6">
        <Button 
          className="w-full"
          disabled={!name || conditions.length === 0}
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Rule
        </Button>
      </div>
    </div>
  );
};
