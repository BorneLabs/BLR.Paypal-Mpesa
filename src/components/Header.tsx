
import React from 'react';
import { ArrowUpFromLine, ArrowDownFromLine } from 'lucide-react';

interface HeaderProps {
  currentRate: number;
  previousRate: number;
}

const Header: React.FC<HeaderProps> = ({ currentRate, previousRate }) => {
  const isIncreasing = currentRate > previousRate;
  const changeAmount = Math.abs(currentRate - previousRate).toFixed(2);
  const changePercent = ((Math.abs(currentRate - previousRate) / previousRate) * 100).toFixed(2);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 py-4 border-b border-border">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-rates-text-primary">
          Bornelabs Live Rates
        </h1>
        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">LIVE</span>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0">
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">{currentRate.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">USD/KES</span>
          </div>
          
          <div className={`flex items-center text-sm ${isIncreasing ? 'text-chart-positive' : 'text-chart-negative'}`}>
            {isIncreasing ? (
              <ArrowUpFromLine className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownFromLine className="h-4 w-4 mr-1" />
            )}
            <span>{changeAmount} ({changePercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
