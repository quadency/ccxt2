import { ExchangeError, PermissionDenied, BadRequest, AuthenticationError, ArgumentsRequired } from './base/errors.js';
import { Exchange } from './base/Exchange.js';
export default class quadency extends Exchange {
    describe() {
        this.userAgent = 'ccxt';
        this.addData = null;
        return this.deepExtend(super.describe(), {
            'id': 'quadency',
            'name': 'Quadency',
            'countries': [],
            'rateLimit': 1000,
            'has': {
                'fetchMarkets': true,
                'fetchTicker': true,
                'fetchOHLCV': true,
                'fetchMyTrades': true,
                'fetchBalance': true,
                'createOrder': true,
            },
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '4h': '240',
                '1d': '1440',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27790564-a945a9d4-5ff9-11e7-9d2d-b635763f2f24.jpg',
                'api': {
                    'public': 'https://quadency.com/api/v1/public/quadx',
                    'private': 'https://quadency.com/api/v1/private/quadx',
                },
                'test': {
                    'public': 'https://staging.quadency.com/api/v1/public/quadx',
                    'private': 'https://staging.quadency.com/api/v1/private/quadx',
                },
                'www': 'https://quadency.com',
            },
            'api': {
                'public': {
                    'get': [
                        'markets',
                        'ticker',
                        'ohlcv',
                    ],
                },
                'private': {
                    'get': [
                        'trades',
                        'balances',
                    ],
                    'post': [
                        'order',
                    ],
                },
            },
            'exceptions': {
                '400': BadRequest,
                '401': AuthenticationError,
                '403': AuthenticationError,
                '429': PermissionDenied,
            },
            'errorMessages': {
                '400': 'Incorrect parameters',
                '401': 'Incorrect keys or ts value differs from the current time by more than 5 seconds',
                '404': 'Not Found',
                '429': 'Too Many Requests: API Rate Limits violated',
                '500': 'Internal Server Error',
                '503': 'System is currently overloaded.',
            },
        });
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        url += '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        if (Object.keys(query).length) {
            url += '?' + this.urlencode(query);
        }
        if (api === 'private') {
            const ts = this.nonce() * 1000;
            const strTs = ts.toString();
            const apiPath = url.split('.com')[1];
            const message = strTs + method + apiPath;
            const signature = this.hmac(this.encode(message), this.encode(this.secret), 'sha256', 'hex');
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-SIGN': signature,
                'ACCESS-TIMESTAMP': strTs,
                'QUADX': 'true',
            };
            if (this.addData) {
                const key = Object.keys(this.addData)[0];
                headers[key] = this.addData[key];
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    parseTradeFee(trade, quote) {
        if ('fee' in trade) {
            const fee = trade['fee'];
            return {
                'cost': this.safeFloat(fee, 'cost', 0),
                'currency': this.safeString(fee, 'currency', quote),
                'rate': this.safeFloat(fee, 'rate', 0),
            };
        }
        return { 'cost': 0, 'currency': quote, 'rate': 0 };
    }
    parseTrade(trade, market = undefined) {
        const timestamp = this.safeInteger(trade, 'e_timestamp');
        const price = this.safeFloat(trade, 'price');
        const amount = this.safeFloat(trade, 'amount');
        const id = this.safeString(trade, 'e_tradeId');
        const orderId = this.safeString(trade, 'e_orderId');
        const side = trade['side'];
        const quote = this.safeString(market, 'quote', 'QUAD');
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': trade['pair'],
            'id': id,
            'order': orderId,
            'type': undefined,
            'takerOrMaker': undefined,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': price * amount,
            'fee': this.parseTradeFee(trade, quote),
        };
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired(this.id + ' fetchMyTrades requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'pairs': market['symbol'],
        };
        if (since !== undefined) {
            request['since'] = since.toString();
        }
        if (limit !== undefined) {
            request['limit'] = limit.toString();
        }
        const response = await this.privateGetTrades(this.extend(request, params));
        return this.parseTrades(response, market, since, limit);
    }
    parseBaseAssets(baseSymbol, symbol, baseAssets) {
        const [base, quote] = symbol.split('/');
        return {
            'id': symbol.replace('/', ''),
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'baseId': base,
            'quoteId': quote,
            'precision': baseAssets[baseSymbol]['precision'],
            // this will be deprecated soon ***
            'taker': this.safeFloat(baseAssets[baseSymbol], 'takerFee') / 100,
            'maker': this.safeFloat(baseAssets[baseSymbol], 'makerFee') / 100,
            'limits': {
                'amount': {
                    'min': this.safeFloat(baseAssets[baseSymbol]['limits']['amount'], 'min'),
                    'max': this.safeFloat(baseAssets[baseSymbol]['limits']['amount'], 'max'),
                },
                'price': {
                    'min': this.safeFloat(baseAssets[baseSymbol]['limits']['price'], 'min'),
                    'max': this.safeFloat(baseAssets[baseSymbol]['limits']['price'], 'max'),
                },
                'cost': {
                    'min': this.safeFloat(baseAssets[baseSymbol]['limits']['cost'], 'min'),
                    'max': this.safeFloat(baseAssets[baseSymbol]['limits']['cost'], 'max'),
                },
            },
            'active': baseAssets[baseSymbol]['buyEnabled'] || baseAssets[baseSymbol]['sellEnabled'],
            'percentage': true,
            'info': {
                'buyEnabled': baseAssets[baseSymbol]['buyEnabled'],
                'sellEnabled': baseAssets[baseSymbol]['sellEnabled'],
                'quadDiscount': this.safeFloat(baseAssets[baseSymbol], 'quadDiscount'),
                'slippageTolerance': this.safeFloat(baseAssets[baseSymbol], 'slippageTolerance'),
                'priceDeviationTolerance': this.safeFloat(baseAssets[baseSymbol], 'priceDeviationTolerance'),
                'liquiditySource': baseAssets[baseSymbol]['liquiditySource'],
                'markupBuy': this.safeFloat(baseAssets[baseSymbol], 'markupBuy'),
                'markupSell': this.safeFloat(baseAssets[baseSymbol], 'markupSell'),
                'filters': baseAssets[baseSymbol]['filters'],
            },
        };
    }
    async fetchMarkets(params = {}) {
        // this will be deprecated soon ***
        const response = await this.publicGetMarkets();
        const USDCBaseAssets = response['markets']['quoteAssets']['USDC']['baseAssets'];
        const USDTBaseAssets = response['markets']['quoteAssets']['USDT']['baseAssets'];
        const USDCBaseSymbols = Object.keys(USDCBaseAssets);
        const USDTBaseSymbols = Object.keys(USDTBaseAssets);
        const result = [];
        for (let i = 0; i < USDCBaseSymbols.length; i++) {
            const entry = this.parseBaseAssets(USDCBaseSymbols[i], USDCBaseAssets[USDCBaseSymbols[i]]['liquidityPair'], USDCBaseAssets);
            result.push(entry);
        }
        for (let i = 0; i < USDTBaseSymbols.length; i++) {
            const entry = this.parseBaseAssets(USDTBaseSymbols[i], USDTBaseAssets[USDTBaseSymbols[i]]['liquidityPair'], USDTBaseAssets);
            result.push(entry);
        }
        return result;
    }
    parseTicker(response) {
        return {
            'price': this.safeFloat(response, 'price'),
            'high': this.safeFloat(response, 'high'),
            'low': this.safeFloat(response, 'low'),
            'price24h': this.safeFloat(response, 'price24h'),
            'volume': this.safeFloat(response, 'volume'),
            'volume24h': this.safeFloat(response, 'volume24h'),
        };
    }
    async fetchTicker(symbol, params = {}) {
        const request = { 'pair': symbol };
        const response = await this.publicGetTicker(this.extend(request, params));
        return this.parseTicker(response);
    }
    async fetchOHLCV(symbol, timeframe = '1h', since = undefined, limit = 1000, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const duration = this.parseTimeframe(timeframe);
        if (since === undefined) {
            since = this.milliseconds() - limit * duration * 1000;
        }
        const endDate = since + limit * duration * 1500;
        params = { 'pair': market['symbol'], 'interval': timeframe, 'startDate': since.toString(), 'endDate': endDate.toString() };
        return await this.publicGetOhlcv(this.extend(params));
    }
    parseOrder(order, sentPair, sentSide, sentAmount) {
        let status = undefined;
        if ('status' in order) {
            status = this.safeString(order, 'status');
            if (status.toLowerCase() === 'ok') {
                status = 'closed';
            }
            else if (status.toLowerCase() === 'failed') {
                status = 'rejected';
            }
            else if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled') {
                status = 'canceled';
            }
        }
        let id = undefined;
        if ('orderId' in order) {
            id = this.safeString(order, 'orderId');
        }
        let pair = sentPair;
        if ('pair' in order) {
            pair = this.safeString(order, 'pair');
        }
        let side = sentSide;
        if ('side' in order) {
            side = this.safeString(order, 'side');
        }
        let price = undefined;
        if ('price' in order) {
            price = this.safeFloat(order, 'price');
        }
        let type = 'MARKET';
        if ('type' in order) {
            type = this.safeString(order, 'type');
        }
        let filled = undefined; // qty size NOT quote
        if ('purchaseAmount' in order) {
            filled = this.safeFloat(order, 'purchaseAmount');
            if (side.toLowerCase() === 'sell') {
                filled = filled / price;
            }
        }
        let amount = sentAmount; // qty size NOT quote
        if ('orderAmount' in order) {
            if (side.toLowerCase() === 'sell') {
                amount = this.safeFloat(order, 'orderAmount');
            }
            else {
                amount = filled;
            }
        }
        let timestamp = undefined;
        if ('timestamp' in order) {
            timestamp = order['timestamp'];
        }
        else {
            timestamp = this.nonce() * 1000;
        }
        let remaining = undefined;
        let cost = undefined; // this is the quote cost
        if (filled !== undefined) {
            if (price !== undefined) {
                cost = price * filled;
            }
            if (amount !== undefined) {
                remaining = amount - filled;
                remaining = Math.max(remaining, 0.0);
            }
        }
        let average = undefined; // execution avg price
        if (cost !== undefined) {
            if (filled) {
                average = cost / filled;
            }
        }
        const fee = undefined;
        const trades = undefined;
        return {
            'info': order,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': pair,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'average': average,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': fee,
            'trades': trades,
        };
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'pair': market['symbol'],
            'side': side,
            'amount': amount,
        };
        if (price) {
            request['price'] = price.toString();
        }
        const response = await this.privatePostOrder(this.extend(request, params));
        return this.parseOrder(response, market['symbol'], request['side'], request['amount']);
    }
    async fetchBalance(params = {}) {
        await this.loadMarkets();
        const balances = await this.privateGetBalances(this.extend(params));
        const result = { 'info': balances };
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            result[balance['asset']] = { 'used': this.safeFloat(balance, 'used'), 'free': this.safeFloat(balance, 'free'), 'total': this.safeFloat(balance, 'total') };
        }
        return result;
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return;
        }
        const error = this.safeString(response, 'errors');
        if (error === undefined) {
            // success
            return;
        }
        const errorMessages = this.errorMessages;
        let message = undefined;
        message = this.safeString(error[0], 'message');
        if (message === undefined) {
            message = this.safeString(errorMessages, code, 'Unknown Error');
        }
        const feedback = this.id + ' ' + message;
        this.throwExactlyMatchedException(this.exceptions, code, feedback);
        throw new ExchangeError(feedback);
    }
}
;
