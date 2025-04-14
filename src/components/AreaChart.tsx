
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from '@/lib/mockData';

interface DataPoint {
  date: Date;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-rates-text-primary font-medium">
          {formatDate(new Date(label))}
        </p>
        <p className="text-rates-text-secondary">
          Rate: <span className="text-rates-text-primary">
            {payload[0].value.toFixed(2)} KES
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Exchange Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                scale="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#C8C8C9', fontSize: 10 }}
                tickFormatter={(value) => formatDate(new Date(value))}
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
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChart;
