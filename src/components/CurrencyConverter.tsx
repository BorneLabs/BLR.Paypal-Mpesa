
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatCurrency, generateMockExchangeRates } from '@/lib/mockData';

const CurrencyConverter: React.FC = () => {
  const [usdAmount, setUsdAmount] = useState<number>(100);
  const [kesAmount, setKesAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(135.5);
  
  useEffect(() => {
    // Get the current rate from our mock data
    const mockData = generateMockExchangeRates(1);
    const currentRate = mockData[mockData.length - 1].close;
    setRate(currentRate);
    
    // Calculate initial KES amount based on the default USD amount
    setKesAmount(usdAmount * currentRate);
    
    // Refresh rate every minute to simulate "live" updates
    const interval = setInterval(() => {
      const newData = generateMockExchangeRates(1);
      const newRate = newData[newData.length - 1].close;
      setRate(newRate);
      setKesAmount(usdAmount * newRate);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Recalculate when USD amount changes
  useEffect(() => {
    setKesAmount(usdAmount * rate);
  }, [usdAmount, rate]);
  
  // Handle USD input change
  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setUsdAmount(value);
    setKesAmount(value * rate);
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="w-full">
              <label htmlFor="usd-amount" className="text-sm text-rates-text-secondary mb-2 block">
                USD Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rates-text-secondary">$</span>
                <Input
                  id="usd-amount"
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  className="pl-7 bg-rates-bg-card text-rates-text-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-6">
              <ArrowRight className="h-5 w-5 text-rates-text-secondary" />
            </div>
            
            <div className="w-full">
              <label htmlFor="kes-amount" className="text-sm text-rates-text-secondary mb-2 block">
                KES Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rates-text-secondary">KSh</span>
                <Input
                  id="kes-amount"
                  type="text"
                  value={kesAmount.toFixed(2)}
                  readOnly
                  className="pl-10 bg-rates-bg-card text-rates-text-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-rates-text-secondary mt-2">
            <p>Current Rate: 1 USD = {rate.toFixed(2)} KES</p>
            <p className="text-xs mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="bg-secondary hover:bg-secondary/80 text-rates-text-primary border-border"
                onClick={() => {
                  setUsdAmount(amount);
                  setKesAmount(amount * rate);
                }}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
