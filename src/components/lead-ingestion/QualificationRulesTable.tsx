
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Play, Pause, Clock, ArrowUp, ArrowDown, Eye, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QualificationRule } from '@/types/leadIngestionTypes';
import { getTimeAgo, getUserById } from '@/data/leadIngestionData';
import { useNavigate } from 'react-router-dom';
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
} from "@/components/ui/alert-dialog";

interface QualificationRulesTableProps {
  rules: QualificationRule[];
  onEdit: (rule: QualificationRule) => void;
  onDelete: (ruleId: string) => void;
  onToggleStatus: (ruleId: string, newStatus: 'active' | 'paused') => void;
}

export const QualificationRulesTable = ({ 
  rules, 
  onEdit, 
  onDelete,
  onToggleStatus 
}: QualificationRulesTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof QualificationRule>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof QualificationRule) => {
    if (sortField === field) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof QualificationRule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const handleViewLeads = (rule: QualificationRule) => {
    // Navigate to lead explorer with journey filter
    navigate(`/lead-explorer?journey=${encodeURIComponent(rule.journey)}`);
  };

  const sortedRules = [...rules].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'updatedAt' || sortField === 'createdAt') {
      aValue = new Date(a[sortField] as string).getTime();
      bValue = new Date(b[sortField] as string).getTime();
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    return sortDirection === 'asc' 
      ? (aValue < bValue ? -1 : 1)
      : (bValue < aValue ? -1 : 1);
  });

  const getStatusBadge = (status: 'active' | 'paused' | 'draft') => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('name')}
          >
            Rule Name {getSortIcon('name')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('journey')}
          >
            Journey {getSortIcon('journey')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('status')}
          >
            Status {getSortIcon('status')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('matchCount')}
          >
            Match Count (Last 24h) {getSortIcon('matchCount')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('updatedAt')}
          >
            Last Updated {getSortIcon('updatedAt')}
          </TableHead>
          <TableHead 
            className="cursor-pointer" 
            onClick={() => handleSort('lastUpdatedBy')}
          >
            Last Updated By {getSortIcon('lastUpdatedBy')}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No qualification rules found. Create your first rule to get started.
            </TableCell>
          </TableRow>
        ) : (
          sortedRules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{rule.name}</span>
                  {rule.description && (
                    <span className="text-xs text-muted-foreground mt-1">{rule.description}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                  {rule.journey}
                </Badge>
              </TableCell>
              <TableCell>
                {getStatusBadge(rule.status)}
              </TableCell>
              <TableCell>{rule.matchCount?.toLocaleString() || 0}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{getTimeAgo(rule.updatedAt)}</span>
                </div>
              </TableCell>
              <TableCell>{getUserById(rule.lastUpdatedBy || rule.createdBy).name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {rule.status === 'draft' ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(rule)}
                        title="Edit Rule"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Delete Rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the qualification rule "{rule.name}". 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(rule.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      {rule.status === 'active' ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onToggleStatus(rule.id, 'paused')}
                          title="Pause Rule"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onToggleStatus(rule.id, 'active')}
                          title="Activate Rule"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(rule)}
                        title="View Rule"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewLeads(rule)}
                        title="View Leads"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Delete Rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the qualification rule "{rule.name}". 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(rule.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
