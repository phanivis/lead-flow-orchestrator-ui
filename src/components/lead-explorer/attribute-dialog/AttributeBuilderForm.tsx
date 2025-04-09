
import React from 'react';
import { Code } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface Attribute {
  id: string;
  name: string;
  type: string;
  source: string;
  description?: string;
}

interface AttributeBuilderFormProps {
  allAttributes: Attribute[];
  newCalculatedAttr: {
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  };
  setNewCalculatedAttr: React.Dispatch<React.SetStateAction<{
    firstAttribute: string;
    operator: string;
    secondAttribute: string;
  }>>;
  availableOperators: {
    value: string;
    label: string;
  }[];
}

export const AttributeBuilderForm: React.FC<AttributeBuilderFormProps> = ({
  allAttributes,
  newCalculatedAttr,
  setNewCalculatedAttr,
  availableOperators
}) => {
  return (
    <>
      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="col-span-3">
          <label className="text-sm font-medium">First Attribute</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                role="combobox"
              >
                {newCalculatedAttr.firstAttribute 
                  ? allAttributes.find(attr => attr.id === newCalculatedAttr.firstAttribute)?.name || "Select attribute" 
                  : "Select attribute"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search attribute..." />
                <CommandEmpty>No attribute found.</CommandEmpty>
                <CommandGroup>
                  {allAttributes.map((attr) => (
                    <CommandItem
                      key={attr.id}
                      value={attr.id}
                      onSelect={() => {
                        setNewCalculatedAttr({
                          ...newCalculatedAttr,
                          firstAttribute: attr.id
                        });
                      }}
                    >
                      {attr.name} ({attr.type})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
              >
                {availableOperators.find(op => op.value === newCalculatedAttr.operator)?.label || "Operator"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {availableOperators.map((op) => (
                <DropdownMenuItem
                  key={op.value}
                  onClick={() => setNewCalculatedAttr({
                    ...newCalculatedAttr,
                    operator: op.value
                  })}
                >
                  {op.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="col-span-3">
          <label className="text-sm font-medium">Second Attribute</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                role="combobox"
              >
                {newCalculatedAttr.secondAttribute 
                  ? allAttributes.find(attr => attr.id === newCalculatedAttr.secondAttribute)?.name || "Select attribute" 
                  : "Select attribute"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search attribute..." />
                <CommandEmpty>No attribute found.</CommandEmpty>
                <CommandGroup>
                  {allAttributes.map((attr) => (
                    <CommandItem
                      key={attr.id}
                      value={attr.id}
                      onSelect={() => {
                        setNewCalculatedAttr({
                          ...newCalculatedAttr,
                          secondAttribute: attr.id
                        });
                      }}
                    >
                      {attr.name} ({attr.type})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="p-3 bg-muted rounded-md mt-4">
        <div className="flex items-start">
          <Code className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Example Transformations:</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Age = Current_date - Date of Birth (using Year Difference)</li>
              <li>• Full Name = First Name + Last Name (using Concatenate)</li>
              <li>• Average Order Value = Total Revenue / Order Count (using Divide)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
