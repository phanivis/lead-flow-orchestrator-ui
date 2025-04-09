
export interface AssignmentRule {
  id: string;
  name: string;
  businessUnit: string;
  campaign: string;
  priority: number;
  conditions: Array<{
    id: `${string}-${string}-${string}-${string}-${string}`;
    attribute: string;
    operator: string;
    value: string;
    value2?: string;
  }>;
}

export interface BusinessUnit {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  businessUnit: string;
}

export interface LeadAttribute {
  id: string;
  name: string;
  type: string;
}

export interface Operator {
  id: string;
  label: string;
}

export const generateUUID = (): `${string}-${string}-${string}-${string}-${string}` => {
  return crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
};

export const getOperatorsForType = (type: string): Operator[] => {
  switch (type) {
    case 'string':
      return [
        { id: 'equals', label: 'Equals' },
        { id: 'contains', label: 'Contains' },
        { id: 'startsWith', label: 'Starts With' },
        { id: 'endsWith', label: 'Ends With' },
      ];
    case 'number':
      return [
        { id: 'equals', label: 'Equals' },
        { id: 'greaterThan', label: 'Greater Than' },
        { id: 'lessThan', label: 'Less Than' },
        { id: 'between', label: 'Between' },
      ];
    case 'boolean':
      return [
        { id: 'equals', label: 'Equals' },
      ];
    default:
      return [];
  }
};
