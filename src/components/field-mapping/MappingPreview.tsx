
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MappingPreviewProps {
  previewData: Record<string, string>[];
  onClose: () => void;
}

const MappingPreview = ({ previewData, onClose }: MappingPreviewProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Preview Results</h3>
        <Button 
          variant="outline"
          size="sm"
          onClick={onClose}
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
    </>
  );
};

export default MappingPreview;
