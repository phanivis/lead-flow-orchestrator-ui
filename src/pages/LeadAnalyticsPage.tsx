
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dummyLeads } from '@/data/dummyLeads';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

// Business units
const businessUnits = [
  { id: 'car', name: 'Car Insurance' },
  { id: 'bike', name: 'Bike Insurance' },
  { id: 'life', name: 'Life Insurance' },
  { id: 'health', name: 'Health Insurance' },
  { id: 'travel', name: 'Travel Insurance' }
];

// Lead stage data for each BU
const generateLeadStageData = (buId: string, fromDate?: Date, toDate?: Date) => {
  // Calculate totals based on dummy leads
  const totalLeads = dummyLeads.length;
  const multiplier = buId === 'car' ? 1 : 
                     buId === 'bike' ? 0.8 : 
                     buId === 'life' ? 1.2 : 
                     buId === 'health' ? 0.9 : 0.7;
  
  // Apply date filter multiplier if dates are selected
  let dateMultiplier = 1;
  if (fromDate && toDate) {
    // Simple date-based multiplier for demo purposes
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    dateMultiplier = Math.min(1, Math.max(0.3, daysDiff / 180)); // Scale based on date range
  }
  
  return [
    { name: 'New', value: Math.round(totalLeads * 0.4 * multiplier * dateMultiplier) },
    { name: 'Qualified', value: Math.round(totalLeads * 0.3 * multiplier * dateMultiplier) },
    { name: 'In Progress', value: Math.round(totalLeads * 0.15 * multiplier * dateMultiplier) },
    { name: 'Converted', value: Math.round(totalLeads * 0.1 * multiplier * dateMultiplier) },
    { name: 'Lost', value: Math.round(totalLeads * 0.05 * multiplier * dateMultiplier) }
  ];
};

// Lead inflow data - last 6 months
const generateInflowData = (buId: string, fromDate?: Date, toDate?: Date) => {
  const baseValue = buId === 'car' ? 120 : 
                   buId === 'bike' ? 90 : 
                   buId === 'life' ? 150 : 
                   buId === 'health' ? 110 : 80;
  
  // Determine date range
  const startDate = fromDate || subMonths(new Date(), 5);
  const endDate = toDate || new Date();
  
  // Calculate number of months to display
  const monthsDiff = (endDate.getMonth() - startDate.getMonth()) + 
                     (12 * (endDate.getFullYear() - startDate.getFullYear()));
  const numMonths = Math.max(1, Math.min(12, monthsDiff + 1));
  
  return Array.from({ length: numMonths }, (_, i) => {
    const month = new Date(startDate);
    month.setMonth(startDate.getMonth() + i);
    // Ensure we don't go past the end date
    if (month > endDate) return null;
    
    return { 
      month: month.toLocaleString('default', { month: 'short' }),
      inflow: Math.round(baseValue + (Math.random() * 40 - 20))
    };
  }).filter(Boolean);
};

// Conversion rate data
const generateConversionData = (buId: string, fromDate?: Date, toDate?: Date) => {
  const baseValue = buId === 'car' ? 18 : 
                    buId === 'bike' ? 15 : 
                    buId === 'life' ? 22 : 
                    buId === 'health' ? 20 : 12;
  
  // Determine date range
  const startDate = fromDate || subMonths(new Date(), 5);
  const endDate = toDate || new Date();
  
  // Calculate number of months to display
  const monthsDiff = (endDate.getMonth() - startDate.getMonth()) + 
                     (12 * (endDate.getFullYear() - startDate.getFullYear()));
  const numMonths = Math.max(1, Math.min(12, monthsDiff + 1));
  
  return Array.from({ length: numMonths }, (_, i) => {
    const month = new Date(startDate);
    month.setMonth(startDate.getMonth() + i);
    // Ensure we don't go past the end date
    if (month > endDate) return null;
    
    return { 
      month: month.toLocaleString('default', { month: 'short' }),
      conversion: Math.round(baseValue + (Math.random() * 8 - 4))
    };
  }).filter(Boolean);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// DateRangeSelector component
const DateRangeSelector = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">From Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : <span>Select start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={onFromDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">To Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "PPP") : <span>Select end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={onToDateChange}
              disabled={(date) => fromDate ? date < fromDate : false}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {(fromDate || toDate) && (
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            onClick={() => {
              onFromDateChange(undefined);
              onToDateChange(undefined);
            }}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

const LeadAnalyticsPage: React.FC = () => {
  const [selectedBU, setSelectedBU] = useState('car');
  const [fromDate, setFromDate] = useState<Date | undefined>(subMonths(new Date(), 6));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  
  const leadStageData = generateLeadStageData(selectedBU, fromDate, toDate);
  const inflowData = generateInflowData(selectedBU, fromDate, toDate);
  const conversionData = generateConversionData(selectedBU, fromDate, toDate);
  
  // Calculate summary stats
  const totalLeads = leadStageData.reduce((sum, item) => sum + item.value, 0);
  const activeLeads = leadStageData
    .filter(item => ['New', 'Qualified', 'In Progress'].includes(item.name))
    .reduce((sum, item) => sum + item.value, 0);
  const convertedLeads = leadStageData.find(item => item.name === 'Converted')?.value || 0;
  const lostLeads = leadStageData.find(item => item.name === 'Lost')?.value || 0;
  const conversionRate = Math.round((convertedLeads / totalLeads) * 100);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Lead Analytics</h1>
        <DateRangeSelector 
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </div>
      
      <Tabs defaultValue="car" onValueChange={setSelectedBU}>
        <TabsList className="mb-6">
          {businessUnits.map(bu => (
            <TabsTrigger key={bu.id} value={bu.id}>
              {bu.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {businessUnits.map(bu => (
          <TabsContent key={bu.id} value={bu.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Leads</CardTitle>
                  <CardDescription>All leads in pipeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalLeads}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Leads</CardTitle>
                  <CardDescription>Currently in pipeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{activeLeads}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Conversion Rate</CardTitle>
                  <CardDescription>Overall conversion</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Lost Leads</CardTitle>
                  <CardDescription>Leads lost</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{lostLeads}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Stages</CardTitle>
                  <CardDescription>Distribution across stages</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer 
                    config={{
                      lead: { color: "#0088FE" },
                      stage: { color: "#00C49F" }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={leadStageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Inflow</CardTitle>
                  <CardDescription>
                    {fromDate && toDate 
                      ? `${format(fromDate, "MMM yyyy")} - ${format(toDate, "MMM yyyy")}`
                      : "Last 6 months"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      inflow: { color: "#0088FE" }
                    }}
                  >
                    <BarChart data={inflowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="inflow" fill="#0088FE" name="New Leads" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate Trend</CardTitle>
                  <CardDescription>
                    {fromDate && toDate 
                      ? `${format(fromDate, "MMM yyyy")} - ${format(toDate, "MMM yyyy")}`
                      : "Last 6 months"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      conversion: { color: "#00C49F" }
                    }}
                  >
                    <LineChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="conversion" 
                        stroke="#00C49F" 
                        name="Conversion Rate" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Key metrics breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">New Leads</span>
                        <span className="text-sm font-medium">
                          {leadStageData.find(item => item.name === 'New')?.value || 0}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-blue-500 rounded" 
                          style={{ width: `${(leadStageData.find(item => item.name === 'New')?.value || 0) / totalLeads * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Qualified Leads</span>
                        <span className="text-sm font-medium">
                          {leadStageData.find(item => item.name === 'Qualified')?.value || 0}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-green-500 rounded" 
                          style={{ width: `${(leadStageData.find(item => item.name === 'Qualified')?.value || 0) / totalLeads * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm font-medium">
                          {leadStageData.find(item => item.name === 'In Progress')?.value || 0}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-yellow-500 rounded" 
                          style={{ width: `${(leadStageData.find(item => item.name === 'In Progress')?.value || 0) / totalLeads * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Converted</span>
                        <span className="text-sm font-medium">
                          {leadStageData.find(item => item.name === 'Converted')?.value || 0}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-green-600 rounded" 
                          style={{ width: `${(leadStageData.find(item => item.name === 'Converted')?.value || 0) / totalLeads * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Lost</span>
                        <span className="text-sm font-medium">
                          {leadStageData.find(item => item.name === 'Lost')?.value || 0}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-2 bg-red-500 rounded" 
                          style={{ width: `${(leadStageData.find(item => item.name === 'Lost')?.value || 0) / totalLeads * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LeadAnalyticsPage;
