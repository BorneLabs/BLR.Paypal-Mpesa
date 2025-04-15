
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
  
  const handleBorneLabsClick = () => {
    window.open('https://www.bornelabs.tech', '_blank');
  };
  
  return (
    <div className="flex flex-col space-y-4 mb-6 py-4 border-b border-border">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={handleBorneLabsClick}>
          <img 
            src="./images/logo.png" 
            alt="Bornelabs Logo" 
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-[#10b0c2]">Borne</span>
            <span className="text-[#fea506]">labs</span>
            <span className="text-rates-text-primary ml-2">Live Rates</span>
          </h1>
          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-[#10b0c2]/20 text-[#10b0c2]">LIVE</span>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{currentRate.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">USD/KES</span>
            </div>
            
            <div className={`flex items-center text-sm ${isIncreasing ? 'text-[#10b0c2]' : 'text-[#fea506]'}`}>
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
      
      <div className="text-center py-2 px-4 rounded-lg">
        <p className="text-sm font-medium">
          Visit <a 
            href="https://www.bornelabs.tech" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#10b0c2] hover:underline"
          >
            Bornelabs
          </a> for more projects
        </p>
      </div>
    </div>
  );
};

export default Header;
