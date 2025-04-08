
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FieldMapping, MappingTable } from '@/components/field-mapping/MappingTable';
import FieldMappingHeader from '@/components/field-mapping/FieldMappingHeader';
import CDPFieldSelector from '@/components/field-mapping/CDPFieldSelector';
import MappingPreview from '@/components/field-mapping/MappingPreview';
import { toast } from 'sonner';

const FieldMappingPage = () => {
  const [mappings, setMappings] = useState<FieldMapping[]>([
    { sourceField: 'first_name', targetField: 'firstName', expression: 'first_name' },
    { sourceField: 'last_name', targetField: 'lastName', expression: 'last_name' },
    { sourceField: 'email_address', targetField: 'email', expression: 'email_address' },
    { sourceField: 'phone_number', targetField: 'phone', expression: 'phone_number' },
    { sourceField: 'interest', targetField: 'productInterest', expression: 'interest' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExpression, setNewExpression] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // CDP fields for demo
  const cdpFields = [
    'user_id', 'first_name', 'last_name', 'email', 'phone', 
    'signup_date', 'last_login_date', 'company_name', 'job_title',
    'lead_source', 'lead_status', 'campaign_id', 'utm_source', 'utm_medium',
    'website_visits', 'page_views', 'subscription_tier'
  ];
  
  // Sample preview data
  const previewData = [
    {
      firstName: 'John', 
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      productInterest: 'Enterprise Plan'
    },
    {
      firstName: 'Sarah', 
      lastName: 'Johnson',
      email: 'sarah.j@acme.co',
      phone: '(555) 987-6543',
      productInterest: 'Professional Plan'
    },
    {
      firstName: 'Michael', 
      lastName: 'Brown',
      email: 'mbrown@bigcorp.com',
      phone: '(555) 456-7890',
      productInterest: 'Basic Plan'
    }
  ];
  
  const handleAddCDPField = (field: string) => {
    if (editingIndex === null) return;
    
    const inputElement = document.getElementById('expressionInput') as HTMLInputElement;
    const cursorPos = inputElement?.selectionStart || newExpression.length;
    const updatedExpression = 
      newExpression.substring(0, cursorPos) + 
      field + 
      newExpression.substring(cursorPos);
    
    setNewExpression(updatedExpression);
  };
  
  const handlePreview = () => {
    setPreviewVisible(true);
    toast.success('Preview generated');
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Mapping Table */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <FieldMappingHeader onPreview={handlePreview} />
            
            <MappingTable
              mappings={mappings}
              setMappings={setMappings}
              editingIndex={editingIndex}
              setEditingIndex={setEditingIndex}
              newExpression={newExpression}
              setNewExpression={setNewExpression}
            />
          </CardContent>
        </Card>
        
        {/* Right Side - CDP Fields */}
        <Card className="w-full md:w-80">
          <CardContent className="p-6">
            <CDPFieldSelector
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              editingIndex={editingIndex}
              onAddField={handleAddCDPField}
              cdpFields={cdpFields}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Preview */}
      {previewVisible && (
        <Card>
          <CardContent className="p-6">
            <MappingPreview 
              previewData={previewData} 
              onClose={() => setPreviewVisible(false)} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FieldMappingPage;
