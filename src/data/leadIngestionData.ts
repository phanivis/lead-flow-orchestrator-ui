
import { EventDefinition, QualificationRule, MatchingUser } from '@/types/leadIngestionTypes';
import { formatDistance } from 'date-fns';

// Sample event definitions
export const eventDefinitions: EventDefinition[] = [
  {
    id: '1',
    name: 'page_view',
    description: 'User viewed a page',
    properties: [
      { id: '1-1', name: 'url', type: 'string' },
      { id: '1-2', name: 'referrer', type: 'string' },
      { id: '1-3', name: 'duration', type: 'number' }
    ]
  },
  {
    id: '2',
    name: 'product_view',
    description: 'User viewed a product page',
    properties: [
      { id: '2-1', name: 'product_id', type: 'string' },
      { id: '2-2', name: 'product_name', type: 'string' },
      { id: '2-3', name: 'product_price', type: 'number' },
      { id: '2-4', name: 'category', type: 'string' }
    ]
  },
  {
    id: '3',
    name: 'add_to_cart',
    description: 'User added a product to cart',
    properties: [
      { id: '3-1', name: 'product_id', type: 'string' },
      { id: '3-2', name: 'product_name', type: 'string' },
      { id: '3-3', name: 'product_price', type: 'number' },
      { id: '3-4', name: 'quantity', type: 'number' }
    ]
  },
  {
    id: '4',
    name: 'checkout_start',
    description: 'User started checkout process',
    properties: [
      { id: '4-1', name: 'cart_value', type: 'number' },
      { id: '4-2', name: 'item_count', type: 'number' }
    ]
  },
  {
    id: '5',
    name: 'checkout_complete',
    description: 'User completed checkout',
    properties: [
      { id: '5-1', name: 'order_id', type: 'string' },
      { id: '5-2', name: 'total_value', type: 'number' },
      { id: '5-3', name: 'payment_method', type: 'string' }
    ]
  },
  {
    id: '6',
    name: 'form_submit',
    description: 'User submitted a form',
    properties: [
      { id: '6-1', name: 'form_id', type: 'string' },
      { id: '6-2', name: 'form_name', type: 'string' },
      { id: '6-3', name: 'form_type', type: 'string' },
      { id: '6-4', name: 'form_data', type: 'object' }
    ]
  },
  {
    id: '7',
    name: 'search',
    description: 'User performed a search',
    properties: [
      { id: '7-1', name: 'query', type: 'string' },
      { id: '7-2', name: 'results_count', type: 'number' }
    ]
  }
];

// Sample qualification rules
export const qualificationRules: QualificationRule[] = [
  {
    id: '1',
    name: 'High-Intent Visitors',
    description: 'Users who view 3+ product pages in a week',
    status: 'active',
    tags: ['product', 'high-intent'],
    conditions: [
      {
        id: '1-1',
        eventName: 'product_view',
        timeFilter: { days: 7 },
        countFilter: { operator: 'greater_than_or_equal', value: 3 },
        operator: 'exists'
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
    name: 'Cart Abandoners',
    description: 'Users who add items to cart but don\'t complete checkout',
    status: 'active',
    tags: ['cart', 'abandonment'],
    conditions: [
      {
        id: '2-1',
        eventName: 'add_to_cart',
        timeFilter: { days: 3 },
        operator: 'exists'
      },
      {
        id: '2-2',
        eventName: 'checkout_complete',
        timeFilter: { days: 3 },
        operator: 'not_exists'
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
    name: 'Form Submitters',
    description: 'Users who submitted a form of any type',
    status: 'paused',
    tags: ['form', 'lead-capture'],
    conditions: [
      {
        id: '3-1',
        eventName: 'form_submit',
        timeFilter: { days: 30 },
        operator: 'exists'
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

// Helper function to get formatted time
export const getTimeAgo = (dateString: string) => {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
};

// Helper function to get user from id
export const getUserById = (id: string): { name: string; email: string } => {
  const users = [
    { id: 'sarah.johnson@acko.com', name: 'Sarah Johnson', email: 'sarah.johnson@acko.com' },
    { id: 'marco.chen@acko.com', name: 'Marco Chen', email: 'marco.chen@acko.com' },
    { id: 'rajat.singh@acko.com', name: 'Rajat Singh', email: 'rajat.singh@acko.com' }
  ];
  
  return users.find(user => user.id === id) || { name: id, email: id };
};
