
import { EventDefinition } from '@/types/leadIngestionTypes';

export const eventDefinitions: EventDefinition[] = [
  {
    id: 'event-1',
    name: 'page_view',
    description: 'User viewed a page on the website',
    lastRefresh: '2025-06-04T10:30:00Z',
    properties: [
      { id: 'prop-1', name: 'page_url', type: 'string', description: 'URL of the viewed page' },
      { id: 'prop-2', name: 'page_title', type: 'string', description: 'Title of the viewed page' },
      { id: 'prop-3', name: 'duration', type: 'number', description: 'Time spent on page in seconds' }
    ]
  },
  {
    id: 'event-2',
    name: 'product_view',
    description: 'User viewed a product page',
    lastRefresh: '2025-06-04T09:15:00Z',
    properties: [
      { id: 'prop-4', name: 'product_id', type: 'string', description: 'Unique product identifier' },
      { id: 'prop-5', name: 'product_name', type: 'string', description: 'Name of the product' },
      { id: 'prop-6', name: 'product_price', type: 'number', description: 'Price of the product' },
      { id: 'prop-7', name: 'category', type: 'string', description: 'Product category' }
    ]
  },
  {
    id: 'event-3',
    name: 'add_to_cart',
    description: 'User added an item to their cart',
    lastRefresh: '2025-06-04T08:45:00Z',
    properties: [
      { id: 'prop-8', name: 'product_id', type: 'string', description: 'Product added to cart' },
      { id: 'prop-9', name: 'quantity', type: 'number', description: 'Quantity added' },
      { id: 'prop-10', name: 'cart_value', type: 'number', description: 'Total cart value after addition' }
    ]
  },
  {
    id: 'event-4',
    name: 'purchase',
    description: 'User completed a purchase',
    lastRefresh: '2025-06-04T11:00:00Z',
    properties: [
      { id: 'prop-11', name: 'order_id', type: 'string', description: 'Unique order identifier' },
      { id: 'prop-12', name: 'total_amount', type: 'number', description: 'Total purchase amount' },
      { id: 'prop-13', name: 'payment_method', type: 'string', description: 'Payment method used' },
      { id: 'prop-14', name: 'currency', type: 'string', description: 'Currency used' }
    ]
  },
  {
    id: 'event-5',
    name: 'form_submit',
    description: 'User submitted a form',
    lastRefresh: '2025-06-04T07:20:00Z',
    properties: [
      { id: 'prop-15', name: 'form_name', type: 'string', description: 'Name of the form submitted' },
      { id: 'prop-16', name: 'form_type', type: 'string', description: 'Type of form (contact, signup, etc.)' },
      { id: 'prop-17', name: 'success', type: 'boolean', description: 'Whether form submission was successful' }
    ]
  },
  {
    id: 'event-6',
    name: 'email_open',
    description: 'User opened an email',
    lastRefresh: '2025-06-04T06:30:00Z',
    properties: [
      { id: 'prop-18', name: 'email_id', type: 'string', description: 'Unique email identifier' },
      { id: 'prop-19', name: 'campaign_name', type: 'string', description: 'Email campaign name' },
      { id: 'prop-20', name: 'subject', type: 'string', description: 'Email subject line' }
    ]
  }
];
