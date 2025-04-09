
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeadStatusBadgeProps {
  status: string;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
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
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};
