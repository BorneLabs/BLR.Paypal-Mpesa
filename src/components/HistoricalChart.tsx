
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMockExchangeRates } from '@/lib/mockData';

interface TimeRange {
  value: string;
  label: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { value: '5d', label: '5 Days', days: 5 },
  { value: '7d', label: '7 Days', days: 7 },
  { value: '1m', label: '1 Month', days: 30 },
  { value: '6m', label: '6 Months', days: 180 },
  { value: '1y', label: '1 Year', days: 365 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-rates-text-primary font-medium">{new Date(label).toLocaleDateString()}</p>
        <p className="text-rates-text-secondary">
          Rate: <span className="text-rates-text-primary">{payload[0].value.toFixed(2)} KES</span>
        </p>
      </div>
    );
  }
  return null;
};

const HistoricalChart: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<string>('5d');
  const [data, setData] = useState<{ date: number; value: number }[]>([]);
  
  useEffect(() => {
    const range = timeRanges.find(r => r.value === selectedRange) || timeRanges[0];
    const mockData = generateMockExchangeRates(range.days);
    
    // Format data for the chart
    const formattedData = mockData.map(item => ({
      date: item.date.getTime(),
      value: item.close,
    }));
    
    setData(formattedData);
  }, [selectedRange]);
  
  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Historical Trend</CardTitle>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[100px] bg-rates-bg-card border-border">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent className="bg-rates-bg-card border-border">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                scale="time" 
                type="number" 
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#C8C8C9', fontSize: 10 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                domain={['auto', 'auto']} 
                tick={{ fill: '#C8C8C9' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0EA5E9" 
                fill="url(#colorValue)" 
              />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;
