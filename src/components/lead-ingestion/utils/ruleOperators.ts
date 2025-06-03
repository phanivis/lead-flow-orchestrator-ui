
import { ConditionOperator } from '@/types/leadIngestionTypes';

export const getOperatorOptions = (attributeType?: string): ConditionOperator[] => {
  const baseOperators: ConditionOperator[] = ['exists', 'not_exists'];
  
  if (!attributeType) return baseOperators;
  
  switch (attributeType) {
    case 'string':
      return [...baseOperators, 'equals', 'not_equals', 'contains', 'not_contains', 'regex'];
    case 'number':
      return [...baseOperators, 'equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'];
    case 'boolean':
      return [...baseOperators, 'equals', 'not_equals'];
    case 'date':
      return [...baseOperators, 'equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'];
    default:
      return baseOperators;
  }
};

export const getOperatorLabel = (operator: ConditionOperator): string => {
  switch (operator) {
    case 'equals': return 'Equals';
    case 'not_equals': return 'Does not equal';
    case 'contains': return 'Contains';
    case 'not_contains': return 'Does not contain';
    case 'regex': return 'Matches regex';
    case 'greater_than': return 'Greater than';
    case 'less_than': return 'Less than';
    case 'greater_than_or_equal': return 'Greater than or equal to';
    case 'less_than_or_equal': return 'Less than or equal to';
    case 'exists': return 'Exists';
    case 'not_exists': return 'Does not exist';
    default: return operator;
  }
};
