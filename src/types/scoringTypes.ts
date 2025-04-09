
export interface ScoringRule {
  id: string;
  business_unit: string;
  description: string;
  criteria: string;
  weight: number;
  isSQL: boolean;
  version?: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
}

export const validateScoringRule = (
  formBusinessUnit: string, 
  criteria: string, 
  weight: number | undefined
): { isValid: boolean, message?: string } => {
  if (!formBusinessUnit) {
    return { isValid: false, message: "Please select a Business Unit" };
  }
  if (!criteria) {
    return { isValid: false, message: "Please enter a Criteria" };
  }
  if (weight === undefined) {
    return { isValid: false, message: "Please enter a Weight" };
  }
  if (weight <= 0 || weight > 100) {
    return { isValid: false, message: "Weight must be between 1 and 100" };
  }
  return { isValid: true };
};
