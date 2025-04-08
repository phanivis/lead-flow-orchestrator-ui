
import React, { useState } from 'react';
import { 
  FileUp, 
  Database, 
  ChevronDown, 
  AlertCircle, 
  Info, 
  Upload 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

const UploadLeadsPage = () => {
  const [uploadMethod, setUploadMethod] = useState('csv');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
  // Demo state for BigQuery selections
  const [project, setProject] = useState('');
  const [dataset, setDataset] = useState('');
  const [table, setTable] = useState('');
  
  // Sample projects, datasets, and tables for demo
  const projects = ['marketing-analytics', 'customer-data', 'sales-pipeline'];
  const datasets = ['leads_data', 'website_visitors', 'campaign_metrics'];
  const tables = ['raw_leads', 'qualified_leads', 'converted_leads'];
  
  // Sample preview data
  const samplePreviewData = [
    { name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', product_interest: 'Enterprise Plan' },
    { name: 'Sarah Johnson', email: 'sarah.j@acme.co', phone: '(555) 987-6543', product_interest: 'Professional Plan' },
    { name: 'Michael Brown', email: 'mbrown@bigcorp.com', phone: '(555) 456-7890', product_interest: 'Basic Plan' },
    { name: 'Emily Davis', email: 'emily.davis@startup.io', phone: '(555) 234-5678', product_interest: 'Enterprise Plan' },
    { name: 'Robert Wilson', email: 'rwilson@gmail.com', phone: '(555) 876-5432', product_interest: 'Professional Plan' },
  ];
  
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
    
    setSelectedFile(file);
    toast.success(`File "${file.name}" selected`);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handlePreviewData = () => {
    if (uploadMethod === 'csv' && !selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }
    
    if (uploadMethod === 'bigquery' && (!project || !dataset || !table)) {
      toast.error('Please select a project, dataset, and table');
      return;
    }
    
    // In a real app, we would process the file or query BigQuery here
    // For demo purposes, we'll just show sample data
    setPreviewData(samplePreviewData);
    toast.success('Data preview generated');
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Tabs 
            defaultValue="csv" 
            onValueChange={setUploadMethod}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                CSV Upload
              </TabsTrigger>
              <TabsTrigger value="bigquery" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                BigQuery Table
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="csv" className="mt-0">
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
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bigquery" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Project
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground inline cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Select the Google Cloud project containing your lead data
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select value={project} onValueChange={setProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Dataset
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground inline cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Select the dataset within this project
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select 
                      value={dataset} 
                      onValueChange={setDataset}
                      disabled={!project}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dataset" />
                      </SelectTrigger>
                      <SelectContent>
                        {datasets.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Table
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground inline cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Select the table containing your lead data
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select 
                      value={table} 
                      onValueChange={setTable}
                      disabled={!dataset}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Data Preview</h3>
              <p className="text-sm text-muted-foreground">
                Showing {previewData.length} of {previewData.length * 20} records
              </p>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(previewData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value as string}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">Back</Button>
              <Button>Proceed to Field Mapping</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadLeadsPage;
