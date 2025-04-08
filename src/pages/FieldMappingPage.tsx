
import React, { useState } from 'react';
import { 
  Shuffle, 
  Save, 
  Search, 
  Check, 
  X, 
  Trash2, 
  ArrowRight, 
  Info, 
  Database,
  DownloadCloud,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface FieldMapping {
  sourceField: string;
  targetField: string;
  expression: string;
}

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
  
  // Available target fields for demo
  const targetFields = [
    'firstName', 'lastName', 'email', 'phone', 'productInterest',
    'company', 'jobTitle', 'leadSource', 'leadStatus', 'signupDate',
    'lastActivity', 'score', 'tags'
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
  
  const handleEditExpression = (index: number) => {
    setEditingIndex(index);
    setNewExpression(mappings[index].expression);
  };
  
  const handleSaveExpression = (index: number) => {
    if (newExpression.trim() === '') {
      toast.error('Expression cannot be empty');
      return;
    }
    
    const updatedMappings = [...mappings];
    updatedMappings[index].expression = newExpression;
    setMappings(updatedMappings);
    setEditingIndex(null);
    setNewExpression('');
    toast.success('Expression updated');
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewExpression('');
  };
  
  const handleDeleteMapping = (index: number) => {
    const updatedMappings = [...mappings];
    updatedMappings.splice(index, 1);
    setMappings(updatedMappings);
    toast.success('Mapping removed');
  };
  
  const handleAddCDPField = (field: string) => {
    if (editingIndex === null) return;
    
    const cursorPos = document.getElementById('expressionInput')?.selectionStart || newExpression.length;
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
  
  const handleSaveTemplate = () => {
    toast.success('Mapping template saved');
  };
  
  const filteredCdpFields = cdpFields.filter(field => 
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Mapping Table */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Field Mapping</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreview}
                >
                  Preview Mapping
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      <span>Save Template</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Mapping Template</DialogTitle>
                      <DialogDescription>
                        Save this mapping for reuse with similar data sources.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <label className="text-sm font-medium">Template Name</label>
                      <Input placeholder="e.g., Marketing Leads Template" className="mt-1" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>Cancel</Button>
                      <Button onClick={handleSaveTemplate}>Save Template</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Field</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Target Field</TableHead>
                    <TableHead>Expression</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{mapping.sourceField}</TableCell>
                      <TableCell>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>{mapping.targetField}</TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex items-center">
                            <Input
                              id="expressionInput"
                              value={newExpression}
                              onChange={(e) => setNewExpression(e.target.value)}
                              className="mr-2"
                              autoFocus
                            />
                            <div className="flex">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveExpression(index)}
                                className="h-8 w-8"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm bg-secondary/40 px-2 py-1 rounded">
                            {mapping.expression}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditExpression(index)}
                            className="h-8 w-8"
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMapping(index)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Tip:</span> You can use SQL expressions like 
                CONCAT(first_name, ' ', last_name) for complex mappings.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Side - CDP Fields */}
        <Card className="w-full md:w-80">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Database className="h-4 w-4 mr-2" />
              CDP Attributes
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-muted-foreground inline cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    Drag these fields or click to add them to your mapping expressions
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            
            <div className="relative mb-4">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="h-[400px] overflow-y-auto border rounded-md p-2">
              {filteredCdpFields.length > 0 ? (
                <ul className="space-y-1">
                  {filteredCdpFields.map((field) => (
                    <li
                      key={field}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-mono cursor-pointer hover:bg-secondary",
                        editingIndex !== null ? "cursor-pointer" : "cursor-default"
                      )}
                      onClick={() => handleAddCDPField(field)}
                    >
                      {field}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  No fields found
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 w-full flex items-center gap-2"
              size="sm"
            >
              <DownloadCloud className="h-4 w-4" />
              Import More Attributes
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Preview */}
      {previewVisible && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Preview Results</h3>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setPreviewVisible(false)}
              >
                Close Preview
              </Button>
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
              <Button>Proceed to Scoring Rules</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FieldMappingPage;
