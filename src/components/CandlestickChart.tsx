
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Bar,
  Line,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateIntradayData, formatDate } from '@/lib/mockData';

interface CandlestickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface FormattedCandlestickData {
  name: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  increase: boolean;
  range: number;
  body: number;
  shadow: number;
}

// Custom tooltip to display OHLC values
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-4">
        <p className="text-rates-text-primary font-medium">{data.name}</p>
        <p className="text-rates-text-secondary">Open: <span className="text-rates-text-primary">{data.open.toFixed(2)}</span></p>
        <p className="text-rates-text-secondary">High: <span className="text-rates-text-primary">{data.high.toFixed(2)}</span></p>
        <p className="text-rates-text-secondary">Low: <span className="text-rates-text-primary">{data.low.toFixed(2)}</span></p>
        <p className="text-rates-text-secondary">Close: <span className="text-rates-text-primary">{data.close.toFixed(2)}</span></p>
        <p className="text-rates-text-secondary">
          Change: <span className={data.increase ? "text-chart-positive" : "text-chart-negative"}>
            {data.increase ? "+" : "-"}{Math.abs(data.close - data.open).toFixed(2)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CandlestickChart: React.FC = () => {
  const [data, setData] = useState<FormattedCandlestickData[]>([]);
  const [latestPrice, setLatestPrice] = useState<number>(0);
  
  useEffect(() => {
    const rawData = generateIntradayData(1); // Get 1 day of intraday data
    
    // Format the data for the recharts
    const formattedData = rawData.map((item: CandlestickData) => {
      const increase = item.close > item.open;
      return {
        name: formatDate(item.date),
        timestamp: item.date.getTime(),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        increase,
        range: item.high - item.low,
        body: Math.abs(item.close - item.open),
        shadow: item.high - item.low,
      };
    });
    
    setData(formattedData);
    
    // Set the latest price
    if (formattedData.length > 0) {
      setLatestPrice(formattedData[formattedData.length - 1].close);
    }
    
    // Simulate real-time updates
    const timer = setInterval(() => {
      const currentData = generateIntradayData(1);
      const lastItem = currentData[currentData.length - 1];
      const increase = lastItem.close > lastItem.open;
      
      const newPoint = {
        name: formatDate(lastItem.date),
        timestamp: lastItem.date.getTime(),
        open: lastItem.open,
        high: lastItem.high,
        low: lastItem.low,
        close: lastItem.close,
        increase,
        range: lastItem.high - lastItem.low,
        body: Math.abs(lastItem.close - lastItem.open),
        shadow: lastItem.high - lastItem.low,
      };
      
      setLatestPrice(lastItem.close);
      
      // Add new point and remove oldest to maintain data size
      setData(prevData => {
        const newData = [...prevData.slice(-48), newPoint];
        return newData;
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            USD/KES
            <span className="text-sm font-normal ml-2 p-1 rounded bg-secondary text-rates-text-secondary">
              Candlestick
            </span>
          </CardTitle>
          <div className="text-xl font-bold">
            <span className={latestPrice > (data[data.length - 2]?.close || 0) ? "text-chart-positive" : "text-chart-negative"}>
              {latestPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                scale="band" 
                tick={{ fill: '#C8C8C9', fontSize: 10 }}
                tickFormatter={(value) => value.split(', ')[0]}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fill: '#C8C8C9' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* High-Low Line */}
              <Bar
                dataKey="shadow"
                fill="transparent"
                stroke="#666"
                barSize={5}
                yAxisId={0}
                name="High-Low Range"
              />
              
              {/* Candlestick Body */}
              <Bar
                dataKey="body"
                yAxisId={0}
                barSize={12}
                fill="transparent"
                stroke="transparent"
                name="Price"
                shape={(props: any) => {
                  const { x, y, width, height, increase } = props;
                  return (
                    <rect
                      x={x - width / 2}
                      y={increase ? y : y - height}
                      width={width}
                      height={Math.max(height, 1)}
                      fill={increase ? '#0EA5E9' : '#EA384C'}
                      stroke="none"
                    />
                  );
                }}
              />
              
              {/* Reference line for yesterday's close */}
              {data.length > 0 && (
                <ReferenceLine y={data[0].close} stroke="#9F9EA1" strokeDasharray="3 3" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandlestickChart;
