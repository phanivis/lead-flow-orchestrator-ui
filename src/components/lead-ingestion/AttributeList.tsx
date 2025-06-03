
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AttributeDefinition } from '@/types/leadIngestionTypes';
import { useState } from 'react';

interface AttributeListProps {
  attributes: AttributeDefinition[];
  onSelectAttribute: (attribute: AttributeDefinition) => void;
  selectedAttributeId?: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'demographic': return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'behavioral': return 'bg-green-50 border-green-200 text-green-800';
    case 'engagement': return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'transaction': return 'bg-orange-50 border-orange-200 text-orange-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const AttributeList = ({ attributes, onSelectAttribute, selectedAttributeId }: AttributeListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttributes = attributes.filter(attr => 
    attr.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attr.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attr.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedAttributes = filteredAttributes.reduce((groups, attr) => {
    const category = attr.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(attr);
    return groups;
  }, {} as Record<string, AttributeDefinition[]>);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Available Attributes</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
        {Object.entries(groupedAttributes).map(([category, attrs]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="space-y-2">
              {attrs.map(attr => (
                <div
                  key={attr.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAttributeId === attr.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onSelectAttribute(attr)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{attr.displayName}</h5>
                    <Badge variant="outline" className={getCategoryColor(attr.category)}>
                      {attr.type}
                    </Badge>
                  </div>
                  {attr.description && (
                    <p className="text-xs text-muted-foreground">{attr.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
