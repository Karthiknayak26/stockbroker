import { useState, useEffect } from 'react';
import { Stock } from '../types';
import { StockPriceService } from '../services/stockService';

export const useStockData = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);

    useEffect(() => {
        const service = StockPriceService.getInstance();
        const unsubscribe = service.subscribe((newStocks) => {
            setStocks(newStocks);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return stocks;
};
