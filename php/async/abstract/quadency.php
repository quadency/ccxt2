<?php

namespace ccxt\async\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class quadency extends \ccxt\async\Exchange {
    public function public_get_markets($params = array()) {
        return $this->request('markets', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_ticker($params = array()) {
        return $this->request('ticker', 'public', 'GET', $params, null, null, array());
    }
    public function public_get_ohlcv($params = array()) {
        return $this->request('ohlcv', 'public', 'GET', $params, null, null, array());
    }
    public function private_get_trades($params = array()) {
        return $this->request('trades', 'private', 'GET', $params, null, null, array());
    }
    public function private_get_balances($params = array()) {
        return $this->request('balances', 'private', 'GET', $params, null, null, array());
    }
    public function private_post_order($params = array()) {
        return $this->request('order', 'private', 'POST', $params, null, null, array());
    }
    public function publicGetMarkets($params = array()) {
        return $this->request('markets', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetTicker($params = array()) {
        return $this->request('ticker', 'public', 'GET', $params, null, null, array());
    }
    public function publicGetOhlcv($params = array()) {
        return $this->request('ohlcv', 'public', 'GET', $params, null, null, array());
    }
    public function privateGetTrades($params = array()) {
        return $this->request('trades', 'private', 'GET', $params, null, null, array());
    }
    public function privateGetBalances($params = array()) {
        return $this->request('balances', 'private', 'GET', $params, null, null, array());
    }
    public function privatePostOrder($params = array()) {
        return $this->request('order', 'private', 'POST', $params, null, null, array());
    }
}
