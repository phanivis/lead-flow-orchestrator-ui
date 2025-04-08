
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import FileUploader from '@/components/upload/FileUploader';
import DataPreview from '@/components/upload/DataPreview';

const UploadLeadsPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
  // Sample preview data
  const samplePreviewData = [
    { name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', product_interest: 'Enterprise Plan' },
    { name: 'Sarah Johnson', email: 'sarah.j@acme.co', phone: '(555) 987-6543', product_interest: 'Professional Plan' },
    { name: 'Michael Brown', email: 'mbrown@bigcorp.com', phone: '(555) 456-7890', product_interest: 'Basic Plan' },
    { name: 'Emily Davis', email: 'emily.davis@startup.io', phone: '(555) 234-5678', product_interest: 'Enterprise Plan' },
    { name: 'Robert Wilson', email: 'rwilson@gmail.com', phone: '(555) 876-5432', product_interest: 'Professional Plan' },
  ];
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };
  
  const handlePreviewData = () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }
    
    // In a real app, we would process the file or query BigQuery here
    // For demo purposes, we'll just show sample data
    setPreviewData(samplePreviewData);
    toast.success('Data preview generated');
  };
  
  const handleBack = () => {
    setPreviewData(null);
  };
  
  const handleProceed = () => {
    // In a real app, we would save the mapping state or context here
    navigate('/field-mapping');
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <FileUploader 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
          
          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={handlePreviewData}
              className="w-full md:w-auto"
            >
              Preview Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {previewData && (
        <Card>
          <CardContent className="p-6">
            <DataPreview 
              data={previewData}
              onBack={handleBack}
              onProceed={handleProceed}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadLeadsPage;
