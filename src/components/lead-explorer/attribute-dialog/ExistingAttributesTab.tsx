
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Attribute {
  id: string;
  name: string;
  type: string;
  source: string;
  description?: string;
}

interface ExistingAttributesTabProps {
  allAttributes: Attribute[];
  selectedAttributes: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSelectAttribute: (attributeId: string) => void;
  handleDeleteCustomAttribute: (attributeId: string) => void;
}

export const ExistingAttributesTab: React.FC<ExistingAttributesTabProps> = ({
  allAttributes,
  selectedAttributes,
  searchTerm,
  setSearchTerm,
  handleSelectAttribute,
  handleDeleteCustomAttribute
}) => {
  const filteredAttributes = allAttributes.filter(attr => 
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Available Attributes</h3>
          <Input 
            placeholder="Search attributes..." 
            className="w-[200px] h-8 text-xs" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto space-y-2">
          {filteredAttributes.map((attribute) => (
            <div 
              key={attribute.id} 
              className="flex justify-between items-center p-2 hover:bg-muted rounded-md"
            >
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedAttributes.includes(attribute.id)} 
                  onChange={() => handleSelectAttribute(attribute.id)}
                  className="rounded border-gray-300"
                />
                <span>{attribute.name}</span>
                <Badge variant="outline" className="text-xs">
                  {attribute.type}
                </Badge>
                <Badge 
                  variant={attribute.source === 'CDP' ? 'secondary' : (
                    attribute.source === 'Calculated' ? 'default' : 'outline'
                  )}
                  className="text-xs"
                >
                  {attribute.source}
                </Badge>
              </div>
              {(attribute.source === 'Custom' || attribute.source === 'Calculated') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => handleDeleteCustomAttribute(attribute.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}

          {filteredAttributes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attributes found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
