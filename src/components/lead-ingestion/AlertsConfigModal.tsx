
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertConfig } from '@/types/leadIngestionTypes';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AlertsConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAlerts?: AlertConfig[];
  onSaveAlerts: (alerts: AlertConfig[]) => void;
}

export const AlertsConfigModal = ({ 
  open, 
  onOpenChange,
  initialAlerts = [],
  onSaveAlerts
}: AlertsConfigModalProps) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>(initialAlerts);
  const [recipientInput, setRecipientInput] = useState('');

  const handleAddAlert = () => {
    const newAlert: AlertConfig = {
      id: `alert-${Date.now()}`,
      threshold: 1000,
      channel: 'slack',
      recipients: [],
      priority: 'medium'
    };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleUpdateAlert = (id: string, updates: Partial<AlertConfig>) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      )
    );
  };

  const handleAddRecipient = (alertId: string) => {
    if (recipientInput.trim()) {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                recipients: [...alert.recipients, recipientInput.trim()]
              } 
            : alert
        )
      );
      setRecipientInput('');
    }
  };

  const handleRemoveRecipient = (alertId: string, recipient: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              recipients: alert.recipients.filter(r => r !== recipient)
            } 
          : alert
      )
    );
  };

  const handleSave = () => {
    onSaveAlerts(alerts);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Alerts</DialogTitle>
          <DialogDescription>
            Set up alerts for when your rule matches certain thresholds
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No alerts configured</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleAddAlert}
              >
                Add Your First Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={alert.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Alert {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 mt-2">
                    <div>
                      <Label htmlFor={`threshold-${alert.id}`}>Threshold (matches per day)</Label>
                      <Input
                        id={`threshold-${alert.id}`}
                        type="number"
                        min="1"
                        value={alert.threshold}
                        onChange={(e) => handleUpdateAlert(alert.id, { 
                          threshold: parseInt(e.target.value) || 1
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Alert Channel</Label>
                      <RadioGroup 
                        value={alert.channel}
                        onValueChange={(value) => handleUpdateAlert(alert.id, { 
                          channel: value as 'slack' | 'email'
                        })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="slack" id={`slack-${alert.id}`} />
                          <Label htmlFor={`slack-${alert.id}`} className="flex items-center cursor-pointer">
                            <MessageSquare className="h-4 w-4 mr-1" /> 
                            Slack
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id={`email-${alert.id}`} />
                          <Label htmlFor={`email-${alert.id}`} className="flex items-center cursor-pointer">
                            <Mail className="h-4 w-4 mr-1" /> 
                            Email
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={alert.priority}
                        onValueChange={(value) => handleUpdateAlert(alert.id, { 
                          priority: value as 'high' | 'medium' | 'low'
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>{alert.channel === 'slack' ? 'Slack Channels' : 'Email Recipients'}</Label>
                      <div className="flex gap-2 mt-1">
                        <Input 
                          placeholder={alert.channel === 'slack' ? "e.g., #growth-team" : "email@example.com"} 
                          value={recipientInput}
                          onChange={(e) => setRecipientInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddRecipient(alert.id);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="secondary"
                          onClick={() => handleAddRecipient(alert.id)}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {alert.recipients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {alert.recipients.map(recipient => (
                            <Badge 
                              key={recipient} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {recipient}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => handleRemoveRecipient(alert.id, recipient)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddAlert}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Alert
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Alerts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
