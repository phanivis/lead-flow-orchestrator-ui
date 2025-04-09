
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  existingPolicyHolder: string;
  ltv: number;
  leadScores: {
    car: number;
    bike: number;
    life: number;
    health: number;
    travel: number;
  };
  status: string;
  lastActivity: string;
  assignedCampaign?: string; // Optional because not all leads will be assigned
}

export const dummyLeads: Lead[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    city: 'Mumbai',
    existingPolicyHolder: 'Yes',
    ltv: 5000,
    leadScores: {
      car: 85,
      bike: 72,
      life: 65,
      health: 78,
      travel: 50
    },
    status: 'Qualified',
    lastActivity: '2025-04-05',
    assignedCampaign: '1', // Spring Car Insurance Campaign
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9876543211',
    city: 'Delhi',
    existingPolicyHolder: 'No',
    ltv: 4200,
    leadScores: {
      car: 65,
      bike: 89,
      life: 72,
      health: 45,
      travel: 81
    },
    status: 'New',
    lastActivity: '2025-04-07',
    assignedCampaign: '5', // Holiday Travel Insurance
  },
  {
    id: '3',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '+91 9876543212',
    city: 'Bangalore',
    existingPolicyHolder: 'Yes',
    ltv: 7800,
    leadScores: {
      car: 58,
      bike: 45,
      life: 90,
      health: 82,
      travel: 67
    },
    status: 'In Progress',
    lastActivity: '2025-04-02',
    assignedCampaign: '3', // Family Life Insurance Campaign
  },
  {
    id: '4',
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    phone: '+91 9876543213',
    city: 'Chennai',
    existingPolicyHolder: 'No',
    ltv: 9500,
    leadScores: {
      car: 91,
      bike: 60,
      life: 55,
      health: 79,
      travel: 83
    },
    status: 'Qualified',
    lastActivity: '2025-04-08',
  },
  {
    id: '5',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 9876543214',
    city: 'Hyderabad',
    existingPolicyHolder: 'Yes',
    ltv: 12000,
    leadScores: {
      car: 62,
      bike: 70,
      life: 93,
      health: 85,
      travel: 50
    },
    status: 'Hot Lead',
    lastActivity: '2025-04-06',
    assignedCampaign: '7', // Student Life Insurance
  },
  {
    id: '6',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 9876543215',
    city: 'Pune',
    existingPolicyHolder: 'No',
    ltv: 3800,
    leadScores: {
      car: 79,
      bike: 58,
      life: 63,
      health: 95,
      travel: 40
    },
    status: 'In Progress',
    lastActivity: '2025-04-04',
    assignedCampaign: '4', // Summer Health Checkup
  },
  {
    id: '7',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    phone: '+91 9876543216',
    city: 'Kolkata',
    existingPolicyHolder: 'Yes',
    ltv: 8200,
    leadScores: {
      car: 81,
      bike: 77,
      life: 50,
      health: 61,
      travel: 90
    },
    status: 'Qualified',
    lastActivity: '2025-04-09',
    assignedCampaign: '2', // Young Riders Bike Campaign
  },
  {
    id: '8',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@example.com',
    phone: '+91 9876543217',
    city: 'Ahmedabad',
    existingPolicyHolder: 'No',
    ltv: 6500,
    leadScores: {
      car: 88,
      bike: 69,
      life: 73,
      health: 47,
      travel: 85
    },
    status: 'New',
    lastActivity: '2025-04-01',
  }
];
