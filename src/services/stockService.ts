import { Stock } from '../types';

// Initial base prices for simulation (INR approx)
const BASE_PRICES: Record<string, number> = {
    'GOOG': 11620.00,
    'TSLA': 20750.00,
    'AMZN': 14940.00,
    'META': 39840.00,
    'NVDA': 74700.00,
};

export class StockPriceService {
    private static instance: StockPriceService;
    private prices: Record<string, number> = { ...BASE_PRICES };
    private listeners: ((stocks: Stock[]) => void)[] = [];
    private intervalId: NodeJS.Timeout | null = null;

    private constructor() {
        this.startSimulation();
    }

    public static getInstance(): StockPriceService {
        if (!StockPriceService.instance) {
            StockPriceService.instance = new StockPriceService();
        }
        return StockPriceService.instance;
    }

    private startSimulation() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            this.updatePrices();
        }, 1000);
    }

    private updatePrices() {
        const updatedStocks: Stock[] = Object.keys(this.prices).map(symbol => {
            const currentPrice = this.prices[symbol];
            // Random walk: -0.5% to +0.5% change
            const changePercent = (Math.random() - 0.5) * 0.01;
            const change = currentPrice * changePercent;
            const newPrice = currentPrice + change;

            this.prices[symbol] = newPrice;

            return {
                symbol,
                name: this.getStockName(symbol),
                price: newPrice,
                change: change,
                changePercent: changePercent * 100,
            };
        });

        this.notifyListeners(updatedStocks);
    }

    private getStockName(symbol: string): string {
        const names: Record<string, string> = {
            'GOOG': 'Alphabet Inc.',
            'TSLA': 'Tesla, Inc.',
            'AMZN': 'Amazon.com, Inc.',
            'META': 'Meta Platforms, Inc.',
            'NVDA': 'NVIDIA Corp.',
        };
        return names[symbol] || symbol;
    }

    public subscribe(listener: (stocks: Stock[]) => void) {
        this.listeners.push(listener);
        // Send immediate update
        listener(this.getCurrentStocks());
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(stocks: Stock[]) {
        this.listeners.forEach(listener => listener(stocks));
    }

    public getCurrentStocks(): Stock[] {
        return Object.keys(this.prices).map(symbol => {
            const currentPrice = this.prices[symbol];
            return {
                symbol,
                name: this.getStockName(symbol),
                price: currentPrice,
                change: 0, // Initial state has no change relative to itself
                changePercent: 0
            }
        })
    }
}
