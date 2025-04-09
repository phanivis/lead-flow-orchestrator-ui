import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from 'lucide-react';

type ScoringRule = {
  id: string;
  business_unit: string;
  criteria: string;
  weight: number;
};

type BusinessUnit = {
  id: string;
  name: string;
};

const ScoringRulesPage: React.FC = () => {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([
    { id: 'car', name: 'Car Insurance' },
    { id: 'bike', name: 'Bike Insurance' },
    { id: 'life', name: 'Life Insurance' },
    { id: 'health', name: 'Health Insurance' },
    { id: 'travel', name: 'Travel Insurance' }
  ]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<BusinessUnit | null>(null);
  const [criteria, setCriteria] = useState<string>('');
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  useEffect(() => {
    const storedRules = localStorage.getItem('scoringRules');
    if (storedRules) {
      setScoringRules(JSON.parse(storedRules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scoringRules', JSON.stringify(scoringRules));
  }, [scoringRules]);

  const handleBusinessUnitChange = (value: string) => {
    const unit = businessUnits.find(bu => bu.id === value);
    setSelectedBusinessUnit(unit || null);
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWeight(isNaN(value) ? undefined : value);
  };

  const validateInput = (): boolean => {
    if (!selectedBusinessUnit) {
      toast({
        title: "Error",
        description: "Please select a Business Unit.",
        variant: "destructive",
      });
      return false;
    }
    if (!criteria) {
      toast({
        title: "Error",
        description: "Please enter a Criteria.",
        variant: "destructive",
      });
      return false;
    }
    if (weight === undefined) {
      toast({
        title: "Error",
        description: "Please enter a Weight.",
        variant: "destructive",
      });
      return false;
    }
    if (weight <= 0 || weight > 100) {
      toast({
        title: "Error",
        description: "Weight must be between 1 and 100.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const addScoringRule = () => {
    if (!validateInput()) return;

    const newRule: ScoringRule = {
      id: Math.random().toString(36).substring(7),
      business_unit: selectedBusinessUnit!.id,
      criteria,
      weight: weight!,
    };

    setScoringRules([...scoringRules, newRule]);
    clearInputFields();
    toast({
      title: "Success",
      description: "Scoring Rule added successfully.",
    });
  };

  const updateScoringRule = () => {
    if (!validateInput()) return;

    const updatedRules = scoringRules.map(rule => {
      if (rule.id === selectedRuleId) {
        return {
          ...rule,
          business_unit: selectedBusinessUnit!.id,
          criteria,
          weight: weight!,
        };
      }
      return rule;
    });

    setScoringRules(updatedRules);
    clearInputFields();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedRuleId(null);
    toast({
      title: "Success",
      description: "Scoring Rule updated successfully.",
    });
  };

  const deleteScoringRule = (id: string) => {
    const updatedRules = scoringRules.filter(rule => rule.id !== id);
    setScoringRules(updatedRules);
    toast({
      title: "Success",
      description: "Scoring Rule deleted successfully.",
    });
  };

  const clearInputFields = () => {
    setSelectedBusinessUnit(null);
    setCriteria('');
    setWeight(undefined);
  };

  const openEditDialog = (ruleId: string) => {
    const ruleToEdit = scoringRules.find(rule => rule.id === ruleId);
    if (ruleToEdit) {
      setSelectedRuleId(ruleId);
      setSelectedBusinessUnit(businessUnits.find(bu => bu.id === ruleToEdit.business_unit) || null);
      setCriteria(ruleToEdit.criteria);
      setWeight(ruleToEdit.weight);
      setIsDialogOpen(true);
      setIsEditMode(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedRuleId(null);
    clearInputFields();
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateScoringRule();
    } else {
      addScoringRule();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scoring Rules</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add/Edit Scoring Rule</CardTitle>
          <CardDescription>
            {selectedBusinessUnit ? selectedBusinessUnit?.name || '' : 'Select a business unit to manage scoring rules.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-unit">Business Unit</Label>
              <Select onValueChange={handleBusinessUnitChange}>
                <SelectTrigger id="business-unit">
                  <SelectValue placeholder="Select a business unit" />
                </SelectTrigger>
                <SelectContent>
                  {businessUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="criteria">Criteria</Label>
              <Input
                type="text"
                id="criteria"
                placeholder="Enter criteria"
                value={criteria}
                onChange={handleCriteriaChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="weight">Weight (1-100)</Label>
            <Input
              type="number"
              id="weight"
              placeholder="Enter weight"
              value={weight !== undefined ? weight.toString() : ''}
              onChange={handleWeightChange}
            />
          </div>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update Rule' : 'Add Rule'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Scoring Rules</CardTitle>
          <CardDescription>View and manage existing scoring rules.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Business Unit</TableHead>
                  <TableHead>Criteria</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoringRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{businessUnits.find(bu => bu.id === rule.business_unit)?.name}</TableCell>
                    <TableCell>{rule.criteria}</TableCell>
                    <TableCell>{rule.weight}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(rule.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the scoring rule.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteScoringRule(rule.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {scoringRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No scoring rules found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditMode ? 'Edit Scoring Rule' : 'Add Scoring Rule'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? 'Update the fields below to edit the scoring rule.' : 'Fill in the fields below to add a new scoring rule.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business-unit">Business Unit</Label>
                <Select onValueChange={handleBusinessUnitChange} defaultValue={selectedBusinessUnit?.id || ''}>
                  <SelectTrigger id="business-unit">
                    <SelectValue placeholder="Select a business unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="criteria">Criteria</Label>
                <Input
                  type="text"
                  id="criteria"
                  placeholder="Enter criteria"
                  value={criteria}
                  onChange={handleCriteriaChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight (1-100)</Label>
              <Input
                type="number"
                id="weight"
                placeholder="Enter weight"
                value={weight !== undefined ? weight.toString() : ''}
                onChange={handleWeightChange}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>{isEditMode ? 'Update' : 'Add'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScoringRulesPage;
