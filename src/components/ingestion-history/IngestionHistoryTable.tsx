
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type IngestionHistoryItem = {
  id: string;
  date: Date;
  source: string;
  filename: string;
  leads: number;
  status: 'successful' | 'failed' | 'processing';
  operator: string;
};

// Sample data for ingestion history
const ingestionHistoryData: IngestionHistoryItem[] = [
  {
    id: '1',
    date: new Date('2025-04-08T14:30:00'),
    source: 'CSV Upload',
    filename: 'enterprise_leads_q2.csv',
    leads: 432,
    status: 'successful',
    operator: 'John Smith',
  },
  {
    id: '2',
    date: new Date('2025-04-07T11:15:00'),
    source: 'API',
    filename: 'salesforce_leads.json',
    leads: 215,
    status: 'successful',
    operator: 'AI Integration',
  },
  {
    id: '3',
    date: new Date('2025-04-06T09:45:00'),
    source: 'CSV Upload',
    filename: 'marketing_campaign_spring.csv',
    leads: 178,
    status: 'failed',
    operator: 'Sarah Johnson',
  },
  {
    id: '4',
    date: new Date('2025-04-05T16:20:00'),
    source: 'Form Submission',
    filename: 'website_leads.json',
    leads: 56,
    status: 'successful',
    operator: 'System',
  },
  {
    id: '5',
    date: new Date('2025-04-04T13:10:00'),
    source: 'CSV Upload',
    filename: 'event_attendees.csv',
    leads: 128,
    status: 'successful',
    operator: 'Michael Davis',
  },
  {
    id: '6',
    date: new Date('2025-04-03T10:30:00'),
    source: 'API',
    filename: 'hubspot_contacts.json',
    leads: 342,
    status: 'processing',
    operator: 'AI Integration',
  },
  {
    id: '7',
    date: new Date('2025-04-02T15:45:00'),
    source: 'CSV Upload',
    filename: 'competitor_leads.csv',
    leads: 87,
    status: 'failed',
    operator: 'Emma Wilson',
  },
];

const IngestionHistoryTable = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'successful':
        return <Badge className="bg-green-500 hover:bg-green-600">Successful</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="text-center">Leads</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingestionHistoryData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {formatDistanceToNow(item.date, { addSuffix: true })}
              </TableCell>
              <TableCell>{item.source}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{item.filename}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.filename}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">{item.leads}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {getStatusIcon(item.status)}
                  {getStatusBadge(item.status)}
                </div>
              </TableCell>
              <TableCell>{item.operator}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  <FileText className="mr-1 h-4 w-4" />
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IngestionHistoryTable;
