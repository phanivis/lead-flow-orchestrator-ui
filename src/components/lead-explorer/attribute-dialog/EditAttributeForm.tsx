
import React from 'react';
import { Calculator, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AttributeBuilderForm } from './AttributeBuilderForm';
import { SqlExpressionForm } from './SqlExpressionForm';

interface EditAttributeFormProps {
  attributeName: string;
  setAttributeName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  editorMode: "builder" | "sql";
  setEditorMode: (mode: "builder" | "sql") => void;
  calculatedAttr: {
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  };
  setCalculatedAttr: React.Dispatch<React.SetStateAction<{
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  }>>;
  sqlExpression: string;
  setSqlExpression: (expression: string) => void;
  resultType: string;
  setResultType: (type: string) => void;
  allAttributes: any[];
}

export const EditAttributeForm: React.FC<EditAttributeFormProps> = ({
  attributeName,
  setAttributeName,
  description,
  setDescription,
  editorMode,
  setEditorMode,
  calculatedAttr,
  setCalculatedAttr,
  sqlExpression,
  setSqlExpression,
  resultType,
  setResultType,
  allAttributes
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Attribute Name</label>
          <Input 
            placeholder="e.g., Age" 
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input 
            placeholder="What this attribute represents" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Editor Mode</label>
        <ToggleGroup 
          type="single" 
          value={editorMode}
          onValueChange={(value) => value && setEditorMode(value as "builder" | "sql")}
          className="justify-start mt-1"
        >
          <ToggleGroupItem value="builder">
            <Calculator className="h-4 w-4 mr-1" />
            Builder
          </ToggleGroupItem>
          <ToggleGroupItem value="sql">
            <Code className="h-4 w-4 mr-1" />
            SQL Expression
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {editorMode === "builder" ? (
        <AttributeBuilderForm
          allAttributes={allAttributes}
          newCalculatedAttr={calculatedAttr}
          setNewCalculatedAttr={setCalculatedAttr}
          availableOperators={[
            { value: '+', label: 'Add (+)' },
            { value: '-', label: 'Subtract (-)' },
            { value: '*', label: 'Multiply (*)' },
            { value: '/', label: 'Divide (/)' },
            { value: 'concat', label: 'Concatenate' },
            { value: 'year_diff', label: 'Year Difference' },
          ]}
        />
      ) : (
        <SqlExpressionForm
          sqlExpression={sqlExpression}
          setSqlExpression={setSqlExpression}
          setResultType={setResultType}
          resultType={resultType}
        />
      )}
    </div>
  );
};
