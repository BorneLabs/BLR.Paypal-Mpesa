
import React, { useState, useEffect } from 'react';
import CandlestickChart from '@/components/CandlestickChart';
import CurrencyConverter from '@/components/CurrencyConverter';
import HistoricalChart from '@/components/HistoricalChart';
import Header from '@/components/Header';
import { generateMockExchangeRates } from '@/lib/mockData';

const Index = () => {
  const [currentRate, setCurrentRate] = useState<number>(135.5);
  const [previousRate, setPreviousRate] = useState<number>(135.3);

  useEffect(() => {
    // Initialize with mock data
    const mockData = generateMockExchangeRates(2);
    setCurrentRate(mockData[mockData.length - 1].close);
    setPreviousRate(mockData[mockData.length - 2].close);

    // Update rates every minute
    const interval = setInterval(() => {
      const newData = generateMockExchangeRates(2);
      setCurrentRate(newData[newData.length - 1].close);
      setPreviousRate(newData[newData.length - 2].close);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-rates-bg text-rates-text-primary">
      <div className="container mx-auto px-4 py-6">
        <Header currentRate={currentRate} previousRate={previousRate} />
        
        <div className="space-y-6">
          <CandlestickChart />
          
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
