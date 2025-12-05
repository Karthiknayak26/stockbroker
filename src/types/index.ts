export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface User {
    email: string;
    id: string;
}

export interface StockDataPoint {
    time: string;
    price: number;
}

export const SUPPORTED_STOCKS = [
    { symbol: 'GOOG', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];
