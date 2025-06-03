
import { AttributeDefinition } from '@/types/leadIngestionTypes';

export const attributeDefinitions: AttributeDefinition[] = [
  // Demographic attributes
  {
    id: 'attr-1',
    name: 'age',
    displayName: 'Age',
    type: 'number',
    description: 'User age in years',
    category: 'demographic'
  },
  {
    id: 'attr-2',
    name: 'city',
    displayName: 'City',
    type: 'string',
    description: 'User city',
    category: 'demographic'
  },
  {
    id: 'attr-3',
    name: 'state',
    displayName: 'State',
    type: 'string',
    description: 'User state',
    category: 'demographic'
  },
  {
    id: 'attr-4',
    name: 'gender',
    displayName: 'Gender',
    type: 'string',
    description: 'User gender',
    category: 'demographic'
  },
  {
    id: 'attr-5',
    name: 'is_premium_user',
    displayName: 'Premium User',
    type: 'boolean',
    description: 'Whether user has premium subscription',
    category: 'demographic'
  },
  
  // Behavioral attributes
  {
    id: 'attr-6',
    name: 'total_page_views',
    displayName: 'Total Page Views',
    type: 'number',
    description: 'Total number of page views',
    category: 'behavioral'
  },
  {
    id: 'attr-7',
    name: 'session_duration_avg',
    displayName: 'Average Session Duration',
    type: 'number',
    description: 'Average session duration in minutes',
    category: 'behavioral'
  },
  {
    id: 'attr-8',
    name: 'last_login_date',
    displayName: 'Last Login Date',
    type: 'date',
    description: 'Date of last login',
    category: 'behavioral'
  },
  {
    id: 'attr-9',
    name: 'device_type',
    displayName: 'Device Type',
    type: 'string',
    description: 'Primary device type used',
    category: 'behavioral'
  },
  
  // Engagement attributes
  {
    id: 'attr-10',
    name: 'email_open_rate',
    displayName: 'Email Open Rate',
    type: 'number',
    description: 'Email open rate percentage',
    category: 'engagement'
  },
  {
    id: 'attr-11',
    name: 'clicked_cta_last_30d',
    displayName: 'Clicked CTA (Last 30 Days)',
    type: 'boolean',
    description: 'Whether user clicked any CTA in last 30 days',
    category: 'engagement'
  },
  {
    id: 'attr-12',
    name: 'newsletter_subscriber',
    displayName: 'Newsletter Subscriber',
    type: 'boolean',
    description: 'Whether user is subscribed to newsletter',
    category: 'engagement'
  },
  
  // Transaction attributes
  {
    id: 'attr-13',
    name: 'total_purchase_value',
    displayName: 'Total Purchase Value',
    type: 'number',
    description: 'Total value of all purchases',
    category: 'transaction'
  },
  {
    id: 'attr-14',
    name: 'last_purchase_date',
    displayName: 'Last Purchase Date',
    type: 'date',
    description: 'Date of last purchase',
    category: 'transaction'
  },
  {
    id: 'attr-15',
    name: 'purchase_frequency',
    displayName: 'Purchase Frequency',
    type: 'number',
    description: 'Number of purchases per month',
    category: 'transaction'
  },
  {
    id: 'attr-16',
    name: 'preferred_payment_method',
    displayName: 'Preferred Payment Method',
    type: 'string',
    description: 'Most used payment method',
    category: 'transaction'
  }
];
