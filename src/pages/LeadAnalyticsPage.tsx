
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

// Business units
const businessUnits = [
  { id: 'car', name: 'Car Insurance' },
  { id: 'bike', name: 'Bike Insurance' },
  { id: 'life', name: 'Life Insurance' },
  { id: 'health', name: 'Health Insurance' },
  { id: 'travel', name: 'Travel Insurance' }
];

// Lead stage data for each BU
const generateLeadStageData = (buId: string) => {
  // Calculate totals based on dummy leads
  const totalLeads = dummyLeads.length;
  const multiplier = buId === 'car' ? 1 : 
                     buId === 'bike' ? 0.8 : 
                     buId === 'life' ? 1.2 : 
                     buId === 'health' ? 0.9 : 0.7;
  
  return [
    { name: 'New', value: Math.round(totalLeads * 0.4 * multiplier) },
    { name: 'Qualified', value: Math.round(totalLeads * 0.3 * multiplier) },
    { name: 'In Progress', value: Math.round(totalLeads * 0.15 * multiplier) },
    { name: 'Converted', value: Math.round(totalLeads * 0.1 * multiplier) },
    { name: 'Lost', value: Math.round(totalLeads * 0.05 * multiplier) }
  ];
};

// Lead inflow data - last 6 months
const generateInflowData = (buId: string) => {
  const baseValue = buId === 'car' ? 120 : 
                   buId === 'bike' ? 90 : 
                   buId === 'life' ? 150 : 
                   buId === 'health' ? 110 : 80;
  
  const currentDate = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - 5 + i);
    return { 
      month: month.toLocaleString('default', { month: 'short' }),
      inflow: Math.round(baseValue + (Math.random() * 40 - 20))
    };
  });
};

// Conversion rate data
const generateConversionData = (buId: string) => {
  const baseValue = buId === 'car' ? 18 : 
                    buId === 'bike' ? 15 : 
                    buId === 'life' ? 22 : 
                    buId === 'health' ? 20 : 12;
  
  const currentDate = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - 5 + i);
    return { 
      month: month.toLocaleString('default', { month: 'short' }),
      conversion: Math.round(baseValue + (Math.random() * 8 - 4))
    };
  });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const LeadAnalyticsPage: React.FC = () => {
  const [selectedBU, setSelectedBU] = useState('car');
  const leadStageData = generateLeadStageData(selectedBU);
  const inflowData = generateInflowData(selectedBU);
  const conversionData = generateConversionData(selectedBU);
  
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lead Analytics</h1>
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
                  <CardDescription>Last 6 months</CardDescription>
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
                  <CardDescription>Last 6 months (%)</CardDescription>
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
