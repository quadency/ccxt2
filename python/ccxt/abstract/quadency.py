from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_markets = publicGetMarkets = Entry('markets', 'public', 'GET', {})
    public_get_ticker = publicGetTicker = Entry('ticker', 'public', 'GET', {})
    public_get_ohlcv = publicGetOhlcv = Entry('ohlcv', 'public', 'GET', {})
    private_get_trades = privateGetTrades = Entry('trades', 'private', 'GET', {})
    private_get_balances = privateGetBalances = Entry('balances', 'private', 'GET', {})
    private_post_order = privatePostOrder = Entry('order', 'private', 'POST', {})
