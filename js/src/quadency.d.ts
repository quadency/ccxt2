import { Exchange } from './base/Exchange.js';
export default class quadency extends Exchange {
    describe(): any;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: any;
        method: string;
        body: any;
        headers: any;
    };
    parseTradeFee(trade: any, quote: any): {
        cost: number;
        currency: any;
        rate: number;
    };
    parseTrade(trade: any, market?: any): {
        info: any;
        timestamp: number;
        datetime: string;
        symbol: any;
        id: string;
        order: string;
        type: any;
        takerOrMaker: any;
        side: any;
        price: number;
        amount: number;
        cost: number;
        fee: {
            cost: number;
            currency: any;
            rate: number;
        };
    };
    fetchMyTrades(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    parseBaseAssets(baseSymbol: any, symbol: any, baseAssets: any): {
        id: any;
        symbol: any;
        base: any;
        quote: any;
        baseId: any;
        quoteId: any;
        precision: any;
        taker: number;
        maker: number;
        limits: {
            amount: {
                min: number;
                max: number;
            };
            price: {
                min: number;
                max: number;
            };
            cost: {
                min: number;
                max: number;
            };
        };
        active: any;
        percentage: boolean;
        info: {
            buyEnabled: any;
            sellEnabled: any;
            quadDiscount: number;
            slippageTolerance: number;
            priceDeviationTolerance: number;
            liquiditySource: any;
            markupBuy: number;
            markupSell: number;
            filters: any;
        };
    };
    fetchMarkets(params?: {}): Promise<any[]>;
    parseTicker(response: any): {
        price: number;
        high: number;
        low: number;
        price24h: number;
        volume: number;
        volume24h: number;
    };
    fetchTicker(symbol: any, params?: {}): Promise<{
        price: number;
        high: number;
        low: number;
        price24h: number;
        volume: number;
        volume24h: number;
    }>;
    fetchOHLCV(symbol: any, timeframe?: string, since?: any, limit?: number, params?: {}): Promise<any>;
    parseOrder(order: any, sentPair: any, sentSide: any, sentAmount: any): {
        info: any;
        id: any;
        timestamp: any;
        datetime: string;
        lastTradeTimestamp: any;
        symbol: any;
        type: string;
        side: any;
        price: any;
        amount: any;
        cost: any;
        average: any;
        filled: any;
        remaining: any;
        status: any;
        fee: any;
        trades: any;
    };
    createOrder(symbol: any, type: any, side: any, amount: any, price?: any, params?: {}): Promise<{
        info: any;
        id: any;
        timestamp: any;
        datetime: string;
        lastTradeTimestamp: any;
        symbol: any;
        type: string;
        side: any;
        price: any;
        amount: any;
        cost: any;
        average: any;
        filled: any;
        remaining: any;
        status: any;
        fee: any;
        trades: any;
    }>;
    fetchBalance(params?: {}): Promise<{
        info: any;
    }>;
    handleErrors(code: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): void;
}
