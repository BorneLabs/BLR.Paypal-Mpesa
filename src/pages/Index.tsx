
import React, { useState, useEffect } from 'react';
import AreaChart from '@/components/AreaChart';
import CurrencyConverter from '@/components/CurrencyConverter';
import HistoricalChart from '@/components/HistoricalChart';
import Header from '@/components/Header';
import { generateMockExchangeRates } from '@/lib/mockData';

const Index = () => {
  const [currentRate, setCurrentRate] = useState<number>(135.5);
  const [previousRate, setPreviousRate] = useState<number>(135.3);
  const [chartData, setChartData] = useState<{ date: Date; value: number }[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateInitialData = () => {
      const mockData = generateMockExchangeRates(5);
      const latestRate = mockData[mockData.length - 1].close;
      const prevRate = mockData[mockData.length - 2].close;

      setCurrentRate(latestRate);
      setPreviousRate(prevRate);

      // Create properly formatted chart data with Date objects
      const formattedData = mockData.map(item => ({
        date: new Date(item.date),
        value: item.close
      }));
      setChartData(formattedData);
    };

    generateInitialData();

    const interval = setInterval(() => {
      generateInitialData();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-rates-bg text-rates-text-primary">
      <div className="container mx-auto px-4 py-6">
        <Header 
          currentRate={currentRate} 
          previousRate={previousRate}
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
