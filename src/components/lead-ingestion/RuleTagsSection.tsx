
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';

interface RuleTagsSectionProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

export const RuleTagsSection = ({
  tags,
  tagInput,
  setTagInput,
  handleAddTag,
  handleRemoveTag,
}: RuleTagsSectionProps) => {
  return (
    <div>
      <Label htmlFor="rule-tags">Tags</Label>
      <div className="flex gap-2">
        <Input 
          id="rule-tags" 
          placeholder="Add tag" 
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" onClick={handleAddTag} variant="secondary">
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveTag(tag)}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
