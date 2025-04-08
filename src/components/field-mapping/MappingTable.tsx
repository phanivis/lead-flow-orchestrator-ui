
import React from 'react';
import { ArrowRight, Check, Code, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  expression: string;
}

interface MappingTableProps {
  mappings: FieldMapping[];
  setMappings: React.Dispatch<React.SetStateAction<FieldMapping[]>>;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  newExpression: string;
  setNewExpression: React.Dispatch<React.SetStateAction<string>>;
}

const MappingTable = ({ 
  mappings, 
  setMappings, 
  editingIndex, 
  setEditingIndex, 
  newExpression, 
  setNewExpression 
}: MappingTableProps) => {
  
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

  return (
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
      <div className="mt-4 text-sm text-muted-foreground p-4">
        <p>
          <span className="font-medium">Tip:</span> You can use SQL expressions like 
          CONCAT(first_name, ' ', last_name) for complex mappings.
        </p>
      </div>
    </div>
  );
};

export default MappingTable;
