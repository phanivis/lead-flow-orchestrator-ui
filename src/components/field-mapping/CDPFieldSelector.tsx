
import React from 'react';
import { Database, DownloadCloud, Info, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CDPFieldSelectorProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  editingIndex: number | null;
  onAddField: (field: string) => void;
  cdpFields: string[];
}

const CDPFieldSelector = ({ 
  searchTerm, 
  setSearchTerm, 
  editingIndex, 
  onAddField, 
  cdpFields 
}: CDPFieldSelectorProps) => {
  
  const filteredCdpFields = cdpFields.filter(field => 
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
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
                onClick={() => onAddField(field)}
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
    </>
  );
};

export default CDPFieldSelector;
