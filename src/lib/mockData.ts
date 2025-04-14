// Helper function to generate random exchange rates within a realistic range
export function generateMockExchangeRates(days: number) {
  const now = new Date();
  const data: { date: Date; open: number; high: number; low: number; close: number }[] = [];
  
  // Starting with a realistic base USD/KES rate
  let previousClose = 135.5;
  
  for (let i = days; i >= 0; i--) {
    // Create a date for each data point
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Generate some randomness, but keep it within reasonable ranges
    const volatility = 0.005; // 0.5% volatility
    const change = previousClose * volatility * (Math.random() * 2 - 1);
    
    const open = previousClose;
    const close = parseFloat((previousClose + change).toFixed(2));
    
    // High and low are derived from open and close
    const high = parseFloat(Math.max(open, close, open + Math.abs(change) * 1.5).toFixed(2));
    const low = parseFloat(Math.min(open, close, open - Math.abs(change) * 1.5).toFixed(2));
    
    data.push({ date, open, high, low, close });
    
    previousClose = close;
  }
  
  return data;
}

// Helper function to format dates for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Helper to format currency values
export function formatCurrency(value: number, currencyCode: string = 'KES'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Generate intraday data for candlestick chart (30-minute intervals)
export function generateIntradayData(days: number = 1) {
  const data: { date: Date; open: number; high: number; low: number; close: number }[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - days);
  start.setHours(0, 0, 0, 0);
  
  let currentRate = 135.5;
  
  while (start <= now) {
    const volatility = 0.002 * (1 + Math.random());
    const change = currentRate * volatility * (Math.random() * 2 - 1);
    
    const open = currentRate;
    const close = parseFloat((currentRate + change).toFixed(2));
    const high = parseFloat(Math.max(open, close, open + Math.abs(change) * 1.2).toFixed(2));
    const low = parseFloat(Math.min(open, close, open - Math.abs(change) * 1.2).toFixed(2));
    
    data.push({
      date: new Date(start),
      open,
      high,
      low,
      close
    });
    
    currentRate = close;
    start.setMinutes(start.getMinutes() + 30);
  }
  
  return data;
}
