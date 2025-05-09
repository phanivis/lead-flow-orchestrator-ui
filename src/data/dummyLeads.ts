// Keep the existing Lead interface at the top
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  leadScore: number;
  status: string;
  lastActivity: string;
  existingPolicyHolder: string;
  tags: string[];
  businessUnit: string;
  source: string;
  updatedAt: string;
}

// Replace or extend the dummyLeads data with our enhanced version that includes the new properties
export const dummyLeads: Lead[] = [
  {
    id: "LD-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
    leadScore: 85,
    status: "Hot Lead",
    lastActivity: "2023-04-10T14:30:00",
    existingPolicyHolder: "Yes",
    tags: ["High Value", "Follow Up"],
    businessUnit: "Auto Insurance",
    source: "Website",
    updatedAt: "2023-04-10T14:30:00"
  },
  {
    id: "LD-002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 87654 32109",
    city: "Delhi",
    leadScore: 65,
    status: "Qualified",
    lastActivity: "2023-04-09T10:15:00",
    existingPolicyHolder: "No",
    tags: ["New Lead", "Price Sensitive"],
    businessUnit: "Health Insurance",
    source: "Mobile App",
    updatedAt: "2023-04-09T10:15:00"
  },
  {
    id: "LD-003",
    name: "Aditya Kumar",
    email: "aditya.kumar@example.com",
    phone: "+91 76543 21098",
    city: "Bangalore",
    leadScore: 40,
    status: "New",
    lastActivity: "2023-04-08T09:45:00",
    existingPolicyHolder: "No",
    tags: ["First Time Buyer"],
    businessUnit: "Life Insurance",
    source: "Partner Referral",
    updatedAt: "2023-04-08T09:45:00"
  },
  {
    id: "LD-004",
    name: "Sunita Reddy",
    email: "sunita.reddy@example.com",
    phone: "+91 65432 10987",
    city: "Hyderabad",
    leadScore: 78,
    status: "In Progress",
    lastActivity: "2023-04-07T16:20:00",
    existingPolicyHolder: "Yes",
    tags: ["Upsell Opportunity", "Loyal Customer"],
    businessUnit: "Health Insurance",
    source: "Email Campaign",
    updatedAt: "2023-04-07T16:20:00"
  },
  {
    id: "LD-005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 54321 09876",
    city: "Chennai",
    leadScore: 90,
    status: "Hot Lead",
    lastActivity: "2023-04-06T11:30:00",
    existingPolicyHolder: "No",
    tags: ["Premium Segment", "Follow Up"],
    businessUnit: "Auto Insurance",
    source: "Website",
    updatedAt: "2023-04-06T11:30:00"
  },
  {
    id: "LD-006",
    name: "Anjali Gupta",
    email: "anjali.gupta@example.com",
    phone: "+91 43210 98765",
    city: "Pune",
    leadScore: 30,
    status: "Cold Lead",
    lastActivity: "2023-04-05T14:50:00",
    existingPolicyHolder: "Yes",
    tags: ["Price Sensitive"],
    businessUnit: "Travel Insurance",
    source: "Social Media",
    updatedAt: "2023-04-05T14:50:00"
  },
  {
    id: "LD-007",
    name: "Raj Malhotra",
    email: "raj.malhotra@example.com",
    phone: "+91 32109 87654",
    city: "Kolkata",
    leadScore: 72,
    status: "Qualified",
    lastActivity: "2023-04-04T09:15:00",
    existingPolicyHolder: "No",
    tags: ["Needs Follow Up"],
    businessUnit: "Home Insurance",
    source: "Call Center",
    updatedAt: "2023-04-04T09:15:00"
  },
  {
    id: "LD-008",
    name: "Meera Verma",
    email: "meera.verma@example.com",
    phone: "+91 21098 76543",
    city: "Ahmedabad",
    leadScore: 55,
    status: "In Progress",
    lastActivity: "2023-04-03T15:40:00",
    existingPolicyHolder: "Yes",
    tags: ["Policy Renewal"],
    businessUnit: "Health Insurance",
    source: "Website",
    updatedAt: "2023-04-03T15:40:00"
  },
  {
    id: "LD-009",
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    phone: "+91 10987 65432",
    city: "Mumbai",
    leadScore: 45,
    status: "New",
    lastActivity: "2023-04-02T10:30:00",
    existingPolicyHolder: "No",
    tags: ["First Time Buyer", "Price Sensitive"],
    businessUnit: "Travel Insurance",
    source: "Mobile App",
    updatedAt: "2023-04-02T10:30:00"
  },
  {
    id: "LD-010",
    name: "Kavita Iyer",
    email: "kavita.iyer@example.com",
    phone: "+91 09876 54321",
    city: "Bangalore",
    leadScore: 88,
    status: "Hot Lead",
    lastActivity: "2023-04-01T13:20:00",
    existingPolicyHolder: "Yes",
    tags: ["High Value", "Policy Upgrade"],
    businessUnit: "Life Insurance",
    source: "Partner Referral",
    updatedAt: "2023-04-01T13:20:00"
  }
];
