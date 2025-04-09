
import { AssignmentRule, BusinessUnit, Campaign, LeadAttribute, generateUUID } from "@/types/assignmentTypes";

export const businessUnits: BusinessUnit[] = [
  { id: 'car', name: 'Car Insurance' },
  { id: 'bike', name: 'Bike Insurance' },
  { id: 'life', name: 'Life Insurance' },
  { id: 'health', name: 'Health Insurance' },
  { id: 'travel', name: 'Travel Insurance' }
];

export const sampleCampaigns: Campaign[] = [
  { id: '1', name: 'Spring Car Insurance Campaign', description: 'Promotional campaign for new car policies', businessUnit: 'car' },
  { id: '2', name: 'Young Riders Bike Campaign', description: 'Targeting young motorcycle enthusiasts', businessUnit: 'bike' },
  { id: '3', name: 'Family Life Insurance Campaign', description: 'Focused on families with young children', businessUnit: 'life' },
  { id: '4', name: 'Summer Health Checkup', description: 'Seasonal health check promotion', businessUnit: 'health' },
  { id: '5', name: 'Holiday Travel Insurance', description: 'Coverage for summer vacation travel', businessUnit: 'travel' },
  { id: '6', name: 'Senior Safe Driving', description: 'Special rates for senior drivers', businessUnit: 'car' },
  { id: '7', name: 'Student Life Insurance', description: 'Affordable coverage for students', businessUnit: 'life' },
];

export const leadAttributes: LeadAttribute[] = [
  { id: 'city', name: 'City', type: 'string' },
  { id: 'existingPolicyHolder', name: 'Existing Policy Holder', type: 'boolean' },
  { id: 'ltv', name: 'Lifetime Value', type: 'number' },
  { id: 'leadScore', name: 'Lead Score', type: 'number' },
  { id: 'status', name: 'Status', type: 'string' },
];

export const sampleAssignmentRules: AssignmentRule[] = [
  {
    id: '1',
    name: 'High Value Mumbai Leads',
    businessUnit: 'car',
    campaign: '1',
    priority: 1,
    operator: 'and',
    conditions: [
      { id: generateUUID(), attribute: 'city', operator: 'equals', value: 'Mumbai' },
      { id: generateUUID(), attribute: 'ltv', operator: 'greaterThan', value: '5000' },
    ]
  },
  {
    id: '2',
    name: 'Existing Customers - Life',
    businessUnit: 'life',
    campaign: '3',
    priority: 2,
    operator: 'and',
    conditions: [
      { id: generateUUID(), attribute: 'existingPolicyHolder', operator: 'equals', value: 'Yes' },
    ]
  },
  {
    id: '3',
    name: 'Qualified Travel Leads',
    businessUnit: 'travel',
    campaign: '5',
    priority: 3,
    operator: 'and',
    conditions: [
      { id: generateUUID(), attribute: 'status', operator: 'equals', value: 'Qualified' },
      { id: generateUUID(), attribute: 'leadScore', operator: 'greaterThan', value: '70' },
    ]
  }
];
