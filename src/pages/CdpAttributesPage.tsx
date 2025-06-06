
import React, { useState } from 'react';
import { LeadAttributeDialog } from '@/components/lead-explorer/LeadAttributeDialog';
import { CreateAttributeDialog } from '@/components/cdp-attributes/CreateAttributeDialog';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Sample attribute data
const attributesList = [
  { id: 1, name: 'Customer Lifetime Value', type: 'Number', source: 'CDP', visible: true, editable: false },
  { id: 2, name: 'Purchase Frequency', type: 'Number', source: 'CDP', visible: true, editable: false },
  { id: 3, name: 'Product Interest', type: 'Text', source: 'LMS', visible: true, editable: true },
  { id: 4, name: 'Engagement Score', type: 'Number', source: 'LMS', visible: true, editable: true, 
    formula: { firstAttribute: '1', operator: '+', secondAttribute: '2' }, description: 'Customer value plus purchase frequency' },
  { id: 5, name: 'Lead Age', type: 'Date', source: 'LMS', visible: false, editable: true, 
    formula: { firstAttribute: '11', operator: 'year_diff', secondAttribute: '12' }, description: 'Years since birth date' },
  { id: 6, name: 'Email Opened', type: 'Boolean', source: 'Marketing', visible: true, editable: false },
  { id: 7, name: 'Last Website Visit', type: 'Date', source: 'Analytics', visible: false, editable: false },
  { id: 8, name: 'Social Media Mentions', type: 'Number', source: 'Social', visible: false, editable: false },
  { id: 9, name: 'Support Tickets', type: 'Number', source: 'Support', visible: true, editable: false },
  { id: 10, name: 'Campaign Response', type: 'Boolean', source: 'LMS', visible: true, editable: true, 
    sqlExpression: 'CASE WHEN [Lead Source] = "Campaign" THEN 1 ELSE 0 END', description: 'Whether lead came from a campaign' },
];

const CdpAttributesPage = () => {
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [attributes, setAttributes] = useState(attributesList);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<number | null>(null);
  
  const openDeleteConfirmation = (id: number) => {
    const attribute = attributes.find(attr => attr.id === id);
    if (attribute && attribute.editable) {
      setAttributeToDelete(id);
      setIsDeleteDialogOpen(true);
    } else {
      toast.error("Cannot delete this attribute");
    }
  };

  const confirmDelete = () => {
    if (attributeToDelete !== null) {
      const attribute = attributes.find(attr => attr.id === attributeToDelete);
      if (attribute) {
        setAttributes(attributes.filter(attr => attr.id !== attributeToDelete));
        toast.success(`${attribute.name} has been deleted`);
      }
      setAttributeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setAttributeToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEditAttribute = (id: number) => {
    const attribute = attributes.find(attr => attr.id === id);
    if (attribute && attribute.editable) {
      setSelectedAttribute(attribute);
      setIsAttributeDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsAttributeDialogOpen(false);
    setSelectedAttribute(null);
  };

  const handleUpdateAttribute = (updatedAttr: any) => {
    setAttributes(
      attributes.map(attr => 
        attr.id === updatedAttr.id ? { ...attr, ...updatedAttr } : attr
      )
    );
    toast.success(`${updatedAttr.name} has been updated`);
    setSelectedAttribute(null);
  };

  const handleCreateAttribute = (newAttribute: any) => {
    setAttributes([...attributes, newAttribute]);
  };

  const handleNewAttributeClick = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Lead Attributes</h1>
          <p className="text-muted-foreground">Manage your customer data and lead attributes</p>
        </div>
        <Button onClick={handleNewAttributeClick}>
          <Plus size={16} className="mr-2" />
          New Attribute
        </Button>
      </div>
      
      <Card className="p-4">
        <h2 className="text-lg font-medium mb-4">LMS Attribute Management</h2>
        <p className="text-sm text-muted-foreground mb-4">Edit or remove attributes that were created in the Lead Management System</p>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attribute Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes
              .filter(attribute => attribute.editable)
              .map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">{attribute.name}</TableCell>
                  <TableCell>{attribute.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAttribute(attribute.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDeleteConfirmation(attribute.id)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      <CreateAttributeDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateAttribute={handleCreateAttribute}
      />

      <LeadAttributeDialog 
        open={isAttributeDialogOpen} 
        onOpenChange={handleCloseDialog}
        attributeToEdit={selectedAttribute}
        onUpdateAttribute={handleUpdateAttribute}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attribute from LMS?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CdpAttributesPage;
