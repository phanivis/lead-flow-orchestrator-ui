export interface EventDefinition {
  id: string;
  name: string;
  description?: string;
  properties: EventProperty[];
}

export interface EventProperty {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  description?: string;
}

export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'regex' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal'
  | 'exists'
  | 'not_exists';

export type LogicalOperator = 'AND' | 'OR';

export interface RuleCondition {
  id: string;
  eventName: string;
  propertyName?: string;
  operator: ConditionOperator;
  value?: string | number | boolean;
  timeFilter?: {
    days: number;
  };
  countFilter?: {
    operator: 'equals' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal';
    value: number;
  };
}

export interface ConditionGroup {
  id: string;
  conditions: RuleCondition[];
  operator: LogicalOperator;
}

export interface QualificationRule {
  id: string;
  name: string;
  description?: string;
  journey: string;
  status: 'active' | 'paused' | 'draft';
  tags: string[];
  conditions: RuleCondition[];
  conditionGroups: ConditionGroup[];
  rootOperator: LogicalOperator;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  matchCount?: number;
  version: number;
  alerts?: AlertConfig[];
}

export interface AlertConfig {
  id: string;
  threshold: number;
  channel: 'slack' | 'email';
  recipients: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface MatchingUser {
  id: string;
  name: string;
  email: string;
  recentEvents: {
    name: string;
    timestamp: string;
  }[];
  score?: number;
  tags: string[];
}
