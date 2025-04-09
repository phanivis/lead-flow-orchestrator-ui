
import React, { useState } from 'react';
import { Search, Filter, Edit, RefreshCcw, UserPlus, Database, Car, Bike, Heart, Briefcase, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LeadAttributeDialog } from '@/components/lead-explorer/LeadAttributeDialog';
import { AssignLeadDialog } from '@/components/lead-explorer/AssignLeadDialog';
import { toast } from 'sonner';

const dummyLeads = [
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

const LeadExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [leads, setLeads] = useState(dummyLeads);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleRefreshData = () => {
    toast.success('Lead data refreshed successfully');
    setTimeout(() => {
      setLeads([...dummyLeads].sort(() => Math.random() - 0.5));
    }, 300);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Hot Lead': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLTV = (ltv: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(ltv);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search leads..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshData}
          >
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAttributeDialogOpen(true)}
          >
            <Database size={16} className="mr-2" />
            CDP Attributes
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsAssignDialogOpen(true)}
            disabled={selectedLeads.length === 0}
          >
            <UserPlus size={16} className="mr-2" />
            Assign Selected
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Existing Policy Holder</TableHead>
              <TableHead>LTV</TableHead>
              <TableHead colSpan={5} className="text-center">Lead Scores by Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead className="p-2 text-center">
                <div className="flex flex-col items-center">
                  <Car className="h-4 w-4 mb-1" />
                  <span className="text-xs">Car</span>
                </div>
              </TableHead>
              <TableHead className="p-2 text-center">
                <div className="flex flex-col items-center">
                  <Bike className="h-4 w-4 mb-1" />
                  <span className="text-xs">Bike</span>
                </div>
              </TableHead>
              <TableHead className="p-2 text-center">
                <div className="flex flex-col items-center">
                  <Heart className="h-4 w-4 mb-1" />
                  <span className="text-xs">Life</span>
                </div>
              </TableHead>
              <TableHead className="p-2 text-center">
                <div className="flex flex-col items-center">
                  <Ambulance className="h-4 w-4 mb-1" />
                  <span className="text-xs">Health</span>
                </div>
              </TableHead>
              <TableHead className="p-2 text-center">
                <div className="flex flex-col items-center">
                  <Briefcase className="h-4 w-4 mb-1" />
                  <span className="text-xs">Travel</span>
                </div>
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell>
                    <Badge className={lead.existingPolicyHolder === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {lead.existingPolicyHolder}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatLTV(lead.ltv)}</TableCell>
                  
                  <TableCell className="p-2">
                    <div className="flex justify-center items-center">
                      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={getScoreColor(lead.leadScores.car)} 
                          style={{ width: `${lead.leadScores.car}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScores.car}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="flex justify-center items-center">
                      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={getScoreColor(lead.leadScores.bike)} 
                          style={{ width: `${lead.leadScores.bike}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScores.bike}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="flex justify-center items-center">
                      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={getScoreColor(lead.leadScores.life)} 
                          style={{ width: `${lead.leadScores.life}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScores.life}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="flex justify-center items-center">
                      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={getScoreColor(lead.leadScores.health)} 
                          style={{ width: `${lead.leadScores.health}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScores.health}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <div className="flex justify-center items-center">
                      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={getScoreColor(lead.leadScores.travel)} 
                          style={{ width: `${lead.leadScores.travel}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScores.travel}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </TableCell>
                  <TableCell>{lead.lastActivity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Assign Owner</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-6 text-gray-500">
                  No leads found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LeadAttributeDialog 
        open={isAttributeDialogOpen} 
        onOpenChange={setIsAttributeDialogOpen} 
      />

      <AssignLeadDialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen} 
        selectedLeadCount={selectedLeads.length}
      />
    </div>
  );
};

export default LeadExplorerPage;
