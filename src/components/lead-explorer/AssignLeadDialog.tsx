
import React, { useState } from 'react';
import { UserPlus, Users, Search, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AssignLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeadCount: number;
}

// Dummy team members
const teamMembers = [
  { id: '1', name: 'Raj Kapoor', role: 'Sales Manager', avatar: '👨🏽‍💼', department: 'Sales' },
  { id: '2', name: 'Neha Gupta', role: 'Sales Representative', avatar: '👩🏽‍💼', department: 'Sales' },
  { id: '3', name: 'Sanjay Patel', role: 'Account Executive', avatar: '👨🏽‍💻', department: 'Sales' },
  { id: '4', name: 'Deepa Sharma', role: 'Sales Development', avatar: '👩🏽‍💻', department: 'Marketing' },
  { id: '5', name: 'Aryan Singh', role: 'Marketing Specialist', avatar: '👨🏽‍🎨', department: 'Marketing' },
  { id: '6', name: 'Tara Khanna', role: 'Customer Success', avatar: '👩🏽‍🔧', department: 'Support' },
];

export const AssignLeadDialog = ({ 
  open, 
  onOpenChange, 
  selectedLeadCount 
}: AssignLeadDialogProps) => {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleAssign = () => {
    if (selectedMember) {
      // In a real application, you would make an API call here
      console.log(`Assigned ${selectedLeadCount} leads to team member ID: ${selectedMember}`);
      onOpenChange(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase()) ||
    member.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign {selectedLeadCount} Lead{selectedLeadCount !== 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <label className="text-sm font-medium">Select Team Member</label>
            <Command className="border rounded-md mt-1">
              <CommandInput 
                placeholder="Search team members..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No team members found.</CommandEmpty>
                <CommandGroup>
                  {filteredMembers.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={member.id}
                      onSelect={(value) => {
                        setSelectedMember(value === selectedMember ? null : value);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-xl">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.department}
                        </Badge>
                        {selectedMember === member.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
