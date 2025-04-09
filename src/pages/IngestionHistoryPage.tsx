
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, Download } from 'lucide-react';
import IngestionHistoryTable from '@/components/ingestion-history/IngestionHistoryTable';
import IngestionFilters from '@/components/ingestion-history/IngestionFilters';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

const IngestionHistoryPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleExport = () => {
    // In a real app, this would trigger a CSV export
    console.log('Exporting ingestion history');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ingestion History</h1>
          <p className="text-muted-foreground">
            View and manage your lead ingestion operations.
          </p>
        </div>
        <Button onClick={handleExport} className="md:w-auto w-full">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Ingestion Summary</CardTitle>
            <CardDescription>
              Overview of your lead ingestion activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Total Ingestions</div>
                <div className="text-3xl font-bold">247</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Leads Ingested</div>
                <div className="text-3xl font-bold">15,832</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Successful</div>
                <div className="text-3xl font-bold text-green-600">241</div>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Failed</div>
                <div className="text-3xl font-bold text-red-600">6</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Ingestion Details</CardTitle>
                <CardDescription>
                  View detailed information about your ingestion operations.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <IngestionFilters 
                  onSourceChange={setSelectedSource}
                  selectedSource={selectedSource}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 pl-3 pr-3 flex items-center gap-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Date Range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <IngestionHistoryTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngestionHistoryPage;
