
import React, { useState } from 'react';
import { LeadAttributeDialog } from '@/components/lead-explorer/LeadAttributeDialog';
import { Button } from '@/components/ui/button';
import { Database, Plus } from 'lucide-react';

const CdpAttributesPage = () => {
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Lead Attributes</h1>
          <p className="text-muted-foreground">Manage your customer data and lead attributes</p>
        </div>
        <Button 
          onClick={() => setIsAttributeDialogOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          New Attribute
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Example attribute cards */}
        {['Customer Lifetime Value', 'Purchase Frequency', 'Product Interest', 'Engagement Score', 'Lead Age'].map((attribute) => (
          <div key={attribute} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className="text-primary" />
              <h3 className="font-medium">{attribute}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Customer data attribute for lead qualification</p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      <LeadAttributeDialog 
        open={isAttributeDialogOpen} 
        onOpenChange={setIsAttributeDialogOpen} 
      />
    </div>
  );
};

export default CdpAttributesPage;
