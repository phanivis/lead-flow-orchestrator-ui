
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BusinessUnit = {
  id: string;
  name: string;
};

interface BusinessUnitSelectorProps {
  selectedBusinessUnit: string;
  businessUnits: BusinessUnit[];
  onBusinessUnitChange: (value: string) => void;
}

export const BusinessUnitSelector: React.FC<BusinessUnitSelectorProps> = ({
  selectedBusinessUnit,
  businessUnits,
  onBusinessUnitChange
}) => {
  return (
    <Select value={selectedBusinessUnit} onValueChange={onBusinessUnitChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by BU" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Business Units</SelectItem>
        {businessUnits.map(bu => (
          <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BusinessUnitSelector;
