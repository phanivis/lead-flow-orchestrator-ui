
import React, { useState } from 'react';
import { FileUp, AlertCircle, Upload, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const FileUploader = ({ onFileSelect, selectedFile }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };
  
  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB
      toast.error('File size exceeds 100MB limit');
      return;
    }
    
    onFileSelect(file);
    toast.success(`File "${file.name}" selected`);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleDownloadSample = () => {
    // Create sample CSV content
    const headers = "name,email,phone,product_interest\n";
    const sampleData = [
      "John Smith,john.smith@example.com,(555) 123-4567,Enterprise Plan",
      "Sarah Johnson,sarah.j@acme.co,(555) 987-6543,Professional Plan",
      "Michael Brown,mbrown@bigcorp.com,(555) 456-7890,Basic Plan"
    ].join("\n");
    
    const csvContent = headers + sampleData;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Sample CSV file downloaded');
  };
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          "transition-colors duration-200"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Drag and drop your CSV file here</h3>
            <p className="text-sm text-muted-foreground mt-1">
              or <span className="text-primary cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>browse</span> to select a file
            </p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>100MB file size limit</span>
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleDownloadSample}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download sample file
          </Button>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      
      {selectedFile && (
        <div className="mt-4 p-4 border rounded-lg bg-secondary/40 flex items-center justify-between">
          <div className="flex items-center">
            <FileUp className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onFileSelect(null as any)}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
