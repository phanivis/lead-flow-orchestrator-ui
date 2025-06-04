
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TIME_PERIOD_OPTIONS = [
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'months', label: 'Months' }
];

interface TimePeriodConfigProps {
  eventTimePeriodType: string;
  eventTimeConfigValue: number | '';
  retargetTimePeriodType: string;
  retargetTimeConfigValue: number | '';
  onEventTimePeriodTypeChange: (value: string) => void;
  onEventTimeConfigValueChange: (value: number | '') => void;
  onRetargetTimePeriodTypeChange: (value: string) => void;
  onRetargetTimeConfigValueChange: (value: number | '') => void;
}

export const TimePeriodConfig = ({
  eventTimePeriodType,
  eventTimeConfigValue,
  retargetTimePeriodType,
  retargetTimeConfigValue,
  onEventTimePeriodTypeChange,
  onEventTimeConfigValueChange,
  onRetargetTimePeriodTypeChange,
  onRetargetTimeConfigValueChange
}: TimePeriodConfigProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Event Time Period Type</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The time period to look back for events when evaluating this rule</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={eventTimePeriodType} onValueChange={onEventTimePeriodTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIOD_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Event Time Config Value</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The number of time periods to look back for events</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="Enter value"
              value={eventTimeConfigValue}
              onChange={(e) => onEventTimeConfigValueChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Retarget Time Period Type</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The time period for retargeting qualified leads</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select value={retargetTimePeriodType} onValueChange={onRetargetTimePeriodTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIOD_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Retarget Time Config Value</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The number of time periods for retargeting duration</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="Enter value"
              value={retargetTimeConfigValue}
              onChange={(e) => onRetargetTimeConfigValueChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
