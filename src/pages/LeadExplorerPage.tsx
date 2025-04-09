
import React, { useState } from 'react';
import { Search, Filter, Edit, PlusCircle, UserPlus, Database } from 'lucide-react';
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

// Dummy data with Indian names
const dummyLeads = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    company: 'TechVista Solutions',
    position: 'Software Engineer',
    leadScore: 85,
    status: 'Qualified',
    lastActivity: '2025-04-05',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9876543211',
    company: 'GlobalServe India',
    position: 'Marketing Manager',
    leadScore: 72,
    status: 'New',
    lastActivity: '2025-04-07',
  },
  {
    id: '3',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '+91 9876543212',
    company: 'Infoway Technologies',
    position: 'Product Manager',
    leadScore: 68,
    status: 'In Progress',
    lastActivity: '2025-04-02',
  },
  {
    id: '4',
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    phone: '+91 9876543213',
    company: 'Quantum Enterprises',
    position: 'Sales Director',
    leadScore: 91,
    status: 'Qualified',
    lastActivity: '2025-04-08',
  },
  {
    id: '5',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 9876543214',
    company: 'Digital Solutions Ltd',
    position: 'CEO',
    leadScore: 93,
    status: 'Hot Lead',
    lastActivity: '2025-04-06',
  },
  {
    id: '6',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 9876543215',
    company: 'Innovative Systems',
    position: 'CTO',
    leadScore: 79,
    status: 'In Progress',
    lastActivity: '2025-04-04',
  },
  {
    id: '7',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    phone: '+91 9876543216',
    company: 'CloudTech Solutions',
    position: 'Technical Lead',
    leadScore: 81,
    status: 'Qualified',
    lastActivity: '2025-04-09',
  },
  {
    id: '8',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@example.com',
    phone: '+91 9876543217',
    company: 'SmartData Analytics',
    position: 'Data Scientist',
    leadScore: 88,
    status: 'New',
    lastActivity: '2025-04-01',
  }
];

const LeadExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(dummyLeads.map(lead => lead.id));
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

  const filteredLeads = dummyLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
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
                  checked={selectedLeads.length === dummyLeads.length && dummyLeads.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-16">Actions</TableHead>
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
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${lead.leadScore >= 80 ? 'bg-green-500' : lead.leadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs">{lead.leadScore}</span>
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
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
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
