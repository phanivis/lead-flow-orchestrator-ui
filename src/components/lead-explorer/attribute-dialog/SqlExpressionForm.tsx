
import React from 'react';
import { Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SqlExpressionFormProps {
  sqlExpression: string;
  setSqlExpression: (expression: string) => void;
  resultType: string;
  setResultType: (type: string) => void;
}

export const SqlExpressionForm: React.FC<SqlExpressionFormProps> = ({
  sqlExpression,
  setSqlExpression,
  resultType,
  setResultType
}) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium">SQL Expression</label>
        <Textarea 
          placeholder="Enter SQL expression, e.g., DATEDIFF(year, [Date of Birth], GETDATE())"
          value={sqlExpression}
          onChange={(e) => setSqlExpression(e.target.value)}
          className="font-mono text-sm h-24"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Result Type</label>
        <Select
          value={resultType}
          onValueChange={setResultType}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-3 bg-muted rounded-md mt-2">
        <div className="flex items-start">
          <Code className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">SQL Expression Examples:</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">CONCAT([First Name], ' ', [Last Name])</code> - Returns full name</li>
              <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">DATEDIFF(year, [Date of Birth], GETDATE())</code> - Returns age</li>
              <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">[Annual Revenue] / [Employee Count]</code> - Returns revenue per employee</li>
              <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">CASE WHEN [Lead Source] = 'Website' THEN 1 ELSE 0 END</code> - Returns boolean</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
