
import { QualificationRule, MatchingUser } from '@/types/leadIngestionTypes';
import { formatDistance } from 'date-fns';

// Sample qualification rules with attribute-based conditions
export const qualificationRules: QualificationRule[] = [
  {
    id: '1',
    name: 'High-Intent Visitors',
    description: 'Users with high page views and engagement',
    journey: 'Car-Fresh',
    status: 'active',
    tags: ['high-intent', 'engagement'],
    conditions: [
      {
        id: '1-1',
        attributeName: 'total_page_views',
        operator: 'greater_than_or_equal',
        value: 10
      },
      {
        id: '1-2',
        attributeName: 'email_open_rate',
        operator: 'greater_than',
        value: 25
      }
    ],
    conditionGroups: [],
    rootOperator: 'AND',
    createdBy: 'sarah.johnson@acko.com',
    createdAt: '2025-02-15T08:30:00Z',
    updatedAt: '2025-02-15T08:30:00Z',
    matchCount: 4521,
    version: 1
  },
  {
    id: '2',
    name: 'Premium Prospects',
    description: 'High-value users with recent activity',
    journey: 'Bike-New',
    status: 'active',
    tags: ['premium', 'high-value'],
    conditions: [
      {
        id: '2-1',
        attributeName: 'total_purchase_value',
        operator: 'greater_than',
        value: 5000
      },
      {
        id: '2-2',
        attributeName: 'last_login_date',
        operator: 'greater_than',
        value: '2025-05-01'
      }
    ],
    conditionGroups: [],
    rootOperator: 'AND',
    createdBy: 'marco.chen@acko.com',
    createdAt: '2025-01-25T14:15:00Z',
    updatedAt: '2025-03-10T16:22:33Z',
    matchCount: 2789,
    version: 3
  },
  {
    id: '3',
    name: 'Engaged Newsletter Subscribers',
    description: 'Active newsletter subscribers from specific cities',
    journey: 'Health-Renewal',
    status: 'paused',
    tags: ['newsletter', 'engagement'],
    conditions: [
      {
        id: '3-1',
        attributeName: 'newsletter_subscriber',
        operator: 'equals',
        value: true
      },
      {
        id: '3-2',
        attributeName: 'city',
        operator: 'contains',
        value: 'Mumbai'
      }
    ],
    conditionGroups: [],
    rootOperator: 'AND',
    createdBy: 'rajat.singh@acko.com',
    createdAt: '2025-03-05T10:45:00Z',
    updatedAt: '2025-03-15T11:20:15Z',
    matchCount: 8754,
    version: 2,
    alerts: [
      {
        id: '3-a1',
        threshold: 10000,
        channel: 'slack',
        recipients: ['#growth-team'],
        priority: 'medium'
      }
    ]
  }
];

// Sample matching users
export const matchingUsers: MatchingUser[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    recentEvents: [
      { name: 'product_view', timestamp: '2025-04-09T14:25:33Z' },
      { name: 'product_view', timestamp: '2025-04-08T11:15:22Z' },
      { name: 'product_view', timestamp: '2025-04-07T16:42:18Z' },
      { name: 'page_view', timestamp: '2025-04-07T16:40:01Z' }
    ],
    score: 85,
    tags: ['high-intent']
  },
  {
    id: 'user-2',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    recentEvents: [
      { name: 'add_to_cart', timestamp: '2025-04-09T09:12:45Z' },
      { name: 'product_view', timestamp: '2025-04-09T09:10:30Z' },
      { name: 'search', timestamp: '2025-04-09T09:05:12Z' },
      { name: 'page_view', timestamp: '2025-04-09T09:00:05Z' }
    ],
    score: 65,
    tags: ['cart', 'abandonment']
  },
  {
    id: 'user-3',
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    recentEvents: [
      { name: 'form_submit', timestamp: '2025-04-08T18:22:17Z' },
      { name: 'page_view', timestamp: '2025-04-08T18:20:05Z' },
      { name: 'page_view', timestamp: '2025-04-08T18:15:33Z' }
    ],
    score: 75,
    tags: ['form', 'lead-capture']
  }
];

// Re-export eventDefinitions for compatibility
export { eventDefinitions } from './eventDefinitions';

export const getTimeAgo = (dateString: string) => {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
};

export const getUserById = (id: string): { name: string; email: string } => {
  const users = [
    { id: 'sarah.johnson@acko.com', name: 'Sarah Johnson', email: 'sarah.johnson@acko.com' },
    { id: 'marco.chen@acko.com', name: 'Marco Chen', email: 'marco.chen@acko.com' },
    { id: 'rajat.singh@acko.com', name: 'Rajat Singh', email: 'rajat.singh@acko.com' }
  ];
  
  return users.find(user => user.id === id) || { name: id, email: id };
};
