
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataPreviewProps {
  data: any[];
  onBack: () => void;
  onProceed: () => void;
}

const DataPreview = ({ data, onBack, onProceed }: DataPreviewProps) => {
  if (!data || data.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Data Preview</h3>
        <p className="text-sm text-muted-foreground">
          Showing {data.length} of {data.length * 20} records
        </p>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(data[0]).map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
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
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onProceed}>Proceed to Field Mapping</Button>
      </div>
    </div>
  );
};

export default DataPreview;
