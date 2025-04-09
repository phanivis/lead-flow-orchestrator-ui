
import React from 'react';
import { HelpCircle } from 'lucide-react';

const SqlExamplesHint: React.FC = () => {
  return (
    <div className="p-3 bg-muted rounded-md mt-2">
      <div className="flex items-start">
        <HelpCircle className="h-5 w-5 mr-2 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">SQL Expression Examples:</p>
          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
            <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">vehicle_type = "Two Wheeler" AND vehicle_value {">"} 100000</code> - Two-Wheeler High Value</li>
            <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">city IN ("Mumbai", "Delhi", "Bangalore", "Chennai")</code> - Metro Cities</li>
            <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">policy_type = "Family Floater" AND members {">="} 3</code> - Family Policy</li>
            <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">annual_income BETWEEN 500000 AND 1500000</code> - Middle Income</li>
            <li>• <code className="bg-gray-200 px-1 py-0.5 rounded">age {">"} 60 OR pre_existing_condition = TRUE</code> - High Risk Health</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SqlExamplesHint;
