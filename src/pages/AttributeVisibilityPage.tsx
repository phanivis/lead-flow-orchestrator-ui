
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Sample attribute data
const attributesList = [
  { id: 1, name: 'Customer Lifetime Value', type: 'Number', source: 'CDP', visible: true, editable: false },
  { id: 2, name: 'Purchase Frequency', type: 'Number', source: 'CDP', visible: true, editable: false },
  { id: 3, name: 'Product Interest', type: 'Text', source: 'LMS', visible: true, editable: true },
  { id: 4, name: 'Engagement Score', type: 'Number', source: 'LMS', visible: true, editable: true },
  { id: 5, name: 'Lead Age', type: 'Date', source: 'LMS', visible: false, editable: true },
  { id: 6, name: 'Email Opened', type: 'Boolean', source: 'Marketing', visible: true, editable: false },
  { id: 7, name: 'Last Website Visit', type: 'Date', source: 'Analytics', visible: false, editable: false },
  { id: 8, name: 'Social Media Mentions', type: 'Number', source: 'Social', visible: false, editable: false },
  { id: 9, name: 'Support Tickets', type: 'Number', source: 'Support', visible: true, editable: false },
  { id: 10, name: 'Campaign Response', type: 'Boolean', source: 'LMS', visible: true, editable: true },
];

const AttributeVisibilityPage = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(attributesList);
  
  const toggleAttributeVisibility = (id: number) => {
    setAttributes(
      attributes.map(attr => 
        attr.id === id ? { ...attr, visible: !attr.visible } : attr
      )
    );
    
    const attribute = attributes.find(attr => attr.id === id);
    if (attribute) {
      toast.success(`${attribute.name} is now ${attribute.visible ? 'hidden' : 'visible'}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attribute Visibility Settings</h1>
          <p className="text-muted-foreground">Toggle attributes to show or hide them in the leads view</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/lead-explorer')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Lead Explorer
        </Button>
      </div>
      
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attribute Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Visibility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.name}</TableCell>
                <TableCell>{attribute.type}</TableCell>
                <TableCell>{attribute.source}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {attribute.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </span>
                    <Switch
                      checked={attribute.visible}
                      onCheckedChange={() => toggleAttributeVisibility(attribute.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AttributeVisibilityPage;
