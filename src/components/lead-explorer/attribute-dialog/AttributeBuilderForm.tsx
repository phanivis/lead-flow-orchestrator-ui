
import React from 'react';
import { Code } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Attribute {
  id: string;
  name: string;
  type: string;
  source: string;
  description?: string;
}

interface AttributeBuilderFormProps {
  allAttributes: Attribute[];
  newCalculatedAttr: {
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  };
  setNewCalculatedAttr: React.Dispatch<React.SetStateAction<{
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  }>>;
  availableOperators: {
    value: string;
    label: string;
  }[];
}

export const AttributeBuilderForm: React.FC<AttributeBuilderFormProps> = ({
  allAttributes,
  newCalculatedAttr,
  setNewCalculatedAttr,
  availableOperators
}) => {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="col-span-3">
          <label className="text-sm font-medium">First Attribute</label>
          <Select
            value={newCalculatedAttr.firstAttribute}
            onValueChange={(value) => setNewCalculatedAttr({
              ...newCalculatedAttr,
              firstAttribute: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select attribute" />
            </SelectTrigger>
            <SelectContent>
              {allAttributes.map((attr) => (
                <SelectItem key={attr.id} value={attr.id}>
                  {attr.name} ({attr.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={newCalculatedAttr.operator}
            onValueChange={(value) => setNewCalculatedAttr({
              ...newCalculatedAttr,
              operator: value
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableOperators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-3">
          <label className="text-sm font-medium">Second Attribute</label>
          <Select
            value={newCalculatedAttr.secondAttribute}
            onValueChange={(value) => setNewCalculatedAttr({
              ...newCalculatedAttr,
              secondAttribute: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select attribute" />
            </SelectTrigger>
            <SelectContent>
              {allAttributes.map((attr) => (
                <SelectItem key={attr.id} value={attr.id}>
                  {attr.name} ({attr.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="p-3 bg-muted rounded-md mt-4">
        <div className="flex items-start">
          <Code className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Example Transformations:</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Age = Current_date - Date of Birth (using Year Difference)</li>
              <li>• Full Name = First Name + Last Name (using Concatenate)</li>
              <li>• Average Order Value = Total Revenue / Order Count (using Divide)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
