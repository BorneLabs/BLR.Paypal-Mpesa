
import React, { useState, useEffect } from 'react';
import AreaChart from '@/components/AreaChart';
import CurrencyConverter from '@/components/CurrencyConverter';
import HistoricalChart from '@/components/HistoricalChart';
import Header from '@/components/Header';
import { generateMockExchangeRates } from '@/lib/mockData';

const Index = () => {
  const [currentRate, setCurrentRate] = useState<number>(135.5);
  const [previousRate, setPreviousRate] = useState<number>(135.3);
  const [trendMessage, setTrendMessage] = useState<string>('');
  const [chartData, setChartData] = useState<{ date: Date; value: number }[]>([]);

  useEffect(() => {
    const mockData = generateMockExchangeRates(5);
    const latestRate = mockData[mockData.length - 1].close;
    const prevRate = mockData[mockData.length - 2].close;
    
    const fiveDayAverage = mockData.reduce((sum, day) => sum + day.close, 0) / mockData.length;
    const isStrengthening = latestRate < fiveDayAverage;
    
    setCurrentRate(latestRate);
    setPreviousRate(prevRate);
    setTrendMessage(
      isStrengthening
        ? "KES is strengthening — consider withdrawing."
        : "KES is weakening — good time to deposit."
    );

    setChartData(mockData.map(item => ({
      date: new Date(item.date),
      value: item.close
    })));

    const interval = setInterval(() => {
      const newData = generateMockExchangeRates(5);
      const newLatestRate = newData[newData.length - 1].close;
      const newPrevRate = newData[newData.length - 2].close;
      const newFiveDayAverage = newData.reduce((sum, day) => sum + day.close, 0) / newData.length;
      const newIsStrengthening = newLatestRate < newFiveDayAverage;
      
      setCurrentRate(newLatestRate);
      setPreviousRate(newPrevRate);
      setTrendMessage(
        newIsStrengthening
          ? "KES is strengthening — consider withdrawing."
          : "KES is weakening — good time to deposit."
      );

      setChartData(newData.map(item => ({
        date: new Date(item.date),
        value: item.close
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-rates-bg text-rates-text-primary">
      <div className="container mx-auto px-4 py-6">
        <Header 
          currentRate={currentRate} 
          previousRate={previousRate}
          trendMessage={trendMessage}
        />
        
        <div className="space-y-6">
          <AreaChart data={chartData} />
          
          <CurrencyConverter />
          
          <HistoricalChart />
          
          <footer className="py-4 text-center text-sm text-rates-text-secondary">
            <p>© 2025 Bornelabs Live Rates. All market data is simulated for demonstration purposes.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
