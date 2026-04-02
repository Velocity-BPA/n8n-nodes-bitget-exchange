/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-bitgetexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';

export class BitgetExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bitget Exchange',
    name: 'bitgetexchange',
    icon: 'file:bitgetexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Bitget Exchange API',
    defaults: {
      name: 'Bitget Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bitgetexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'SpotTrading',
            value: 'spotTrading',
          },
          {
            name: 'FuturesTrading',
            value: 'futuresTrading',
          },
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'CopyTrading',
            value: 'copyTrading',
          },
          {
            name: 'EarnProducts',
            value: 'earnProducts',
          }
        ],
        default: 'spotTrading',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
		},
	},
	options: [
		{
			name: 'Place Order',
			value: 'placeOrder',
			description: 'Place a spot order',
			action: 'Place a spot order',
		},
		{
			name: 'Get Order',
			value: 'getOrder',
			description: 'Get order details',
			action: 'Get order details',
		},
		{
			name: 'Get Open Orders',
			value: 'getOpenOrders',
			description: 'Get all open orders',
			action: 'Get all open orders',
		},
		{
			name: 'Get Order History',
			value: 'getOrderHistory',
			description: 'Get order history',
			action: 'Get order history',
		},
		{
			name: 'Cancel Order',
			value: 'cancelOrder',
			description: 'Cancel an order',
			action: 'Cancel an order',
		},
		{
			name: 'Batch Place Orders',
			value: 'batchPlaceOrders',
			description: 'Place multiple orders',
			action: 'Place multiple orders',
		},
		{
			name: 'Batch Cancel Orders',
			value: 'batchCancelOrders',
			description: 'Cancel multiple orders',
			action: 'Cancel multiple orders',
		},
	],
	default: 'placeOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['futuresTrading'] } },
  options: [
    { name: 'Place Order', value: 'placeOrder', description: 'Place a futures order', action: 'Place order' },
    { name: 'Get Order', value: 'getOrder', description: 'Get futures order details', action: 'Get order details' },
    { name: 'Get Open Orders', value: 'getOpenOrders', description: 'Get current futures orders', action: 'Get open orders' },
    { name: 'Get Order History', value: 'getOrderHistory', description: 'Get futures order history', action: 'Get order history' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel futures order', action: 'Cancel order' },
    { name: 'Get Position', value: 'getPosition', description: 'Get position details', action: 'Get position' },
    { name: 'Get All Positions', value: 'getAllPositions', description: 'Get all positions', action: 'Get all positions' },
  ],
  default: 'placeOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marketData'] } },
  options: [
    { name: 'Get All Spot Tickers', value: 'getTickers', description: 'Get all spot market tickers', action: 'Get all spot tickers' },
    { name: 'Get Single Ticker', value: 'getTicker', description: 'Get ticker for a specific symbol', action: 'Get single ticker' },
    { name: 'Get Orderbook', value: 'getOrderbook', description: 'Get orderbook data for a symbol', action: 'Get orderbook data' },
    { name: 'Get Candles', value: 'getCandles', description: 'Get candlestick data for a symbol', action: 'Get candlestick data' },
    { name: 'Get Recent Trades', value: 'getRecentTrades', description: 'Get recent trades for a symbol', action: 'Get recent trades' },
    { name: 'Get Historical Trades', value: 'getHistoricalTrades', description: 'Get historical trades for a symbol', action: 'Get historical trades' },
    { name: 'Get Futures Tickers', value: 'getFuturesTickers', description: 'Get futures market tickers', action: 'Get futures tickers' },
    { name: 'Get Futures Ticker', value: 'getFuturesTicker', description: 'Get single futures ticker', action: 'Get futures ticker' },
  ],
  default: 'getTickers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account Info', value: 'getAccountInfo', description: 'Get spot account info', action: 'Get spot account info' },
    { name: 'Get Assets', value: 'getAssets', description: 'Get spot account assets', action: 'Get spot account assets' },
    { name: 'Get Futures Account', value: 'getFuturesAccount', description: 'Get futures account info', action: 'Get futures account info' },
    { name: 'Get Futures Accounts', value: 'getFuturesAccounts', description: 'Get all futures accounts', action: 'Get all futures accounts' },
    { name: 'Transfer', value: 'transfer', description: 'Transfer between accounts', action: 'Transfer between accounts' },
    { name: 'Get Transfer History', value: 'getTransferHistory', description: 'Get transfer history', action: 'Get transfer history' },
    { name: 'Get Bills', value: 'getBills', description: 'Get account bills', action: 'Get account bills' },
  ],
  default: 'getAccountInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['copyTrading'] } },
  options: [
    { name: 'Get Current Copy Orders', value: 'getCurrentCopyOrders', description: 'Get current copy trading orders', action: 'Get current copy orders' },
    { name: 'Get Copy Order History', value: 'getCopyOrderHistory', description: 'Get copy trading order history', action: 'Get copy order history' },
    { name: 'Close Copy Position', value: 'closeCopyPosition', description: 'Close copy trading position', action: 'Close copy position' },
    { name: 'Get Profit Summary', value: 'getProfitSummary', description: 'Get copy trading profit summary', action: 'Get profit summary' },
    { name: 'Get Profit History', value: 'getProfitHistory', description: 'Get historical profit data', action: 'Get profit history' },
    { name: 'Get Follower Orders', value: 'getFollowerOrders', description: 'Get follower current orders', action: 'Get follower orders' },
    { name: 'Set Take Profit Stop Loss', value: 'setTpSl', description: 'Set take profit stop loss for copy trading', action: 'Set take profit stop loss' }
  ],
  default: 'getCurrentCopyOrders',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['earnProducts'],
		},
	},
	options: [
		{
			name: 'Get Savings Products',
			value: 'getSavingsProducts',
			description: 'Get available savings products',
			action: 'Get savings products',
		},
		{
			name: 'Subscribe Savings',
			value: 'subscribeSavings',
			description: 'Subscribe to savings product',
			action: 'Subscribe to savings product',
		},
		{
			name: 'Redeem Savings',
			value: 'redeemSavings',
			description: 'Redeem from savings product',
			action: 'Redeem from savings product',
		},
		{
			name: 'Get Savings Account',
			value: 'getSavingsAccount',
			description: 'Get savings account details',
			action: 'Get savings account details',
		},
		{
			name: 'Get Savings Assets',
			value: 'getSavingsAssets',
			description: 'Get savings assets',
			action: 'Get savings assets',
		},
		{
			name: 'Get Savings History',
			value: 'getSavingsHistory',
			description: 'Get savings operation history',
			action: 'Get savings operation history',
		},
		{
			name: 'Get Sharkfin Products',
			value: 'getSharkfinProducts',
			description: 'Get structured products',
			action: 'Get structured products',
		},
	],
	default: 'getSavingsProducts',
},
{
	displayName: 'Symbol',
	name: 'symbol',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder', 'getOrder', 'getOpenOrders', 'getOrderHistory', 'cancelOrder', 'batchPlaceOrders', 'batchCancelOrders'],
		},
	},
	default: '',
	description: 'Trading pair symbol (e.g., BTCUSDT)',
},
{
	displayName: 'Side',
	name: 'side',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder'],
		},
	},
	options: [
		{
			name: 'Buy',
			value: 'buy',
		},
		{
			name: 'Sell',
			value: 'sell',
		},
	],
	default: 'buy',
	description: 'Order side',
},
{
	displayName: 'Order Type',
	name: 'orderType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder'],
		},
	},
	options: [
		{
			name: 'Limit',
			value: 'limit',
		},
		{
			name: 'Market',
			value: 'market',
		},
	],
	default: 'limit',
	description: 'Order type',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder'],
			orderType: ['limit'],
		},
	},
	default: '',
	description: 'Order price (required for limit orders)',
},
{
	displayName: 'Quantity',
	name: 'quantity',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder'],
		},
	},
	default: '',
	description: 'Order quantity',
},
{
	displayName: 'Force',
	name: 'force',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['placeOrder'],
		},
	},
	options: [
		{
			name: 'GTC',
			value: 'gtc',
		},
		{
			name: 'IOC',
			value: 'ioc',
		},
		{
			name: 'FOK',
			value: 'fok',
		},
	],
	default: 'gtc',
	description: 'Time in force',
},
{
	displayName: 'Order ID',
	name: 'orderId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['getOrder', 'cancelOrder'],
		},
	},
	default: '',
	description: 'Order ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['getOpenOrders', 'getOrderHistory'],
		},
	},
	default: 100,
	description: 'Number of records to return',
},
{
	displayName: 'After',
	name: 'after',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['getOrderHistory'],
		},
	},
	default: '',
	description: 'Start time for pagination',
},
{
	displayName: 'Before',
	name: 'before',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['getOrderHistory'],
		},
	},
	default: '',
	description: 'End time for pagination',
},
{
	displayName: 'Order List',
	name: 'orderList',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['batchPlaceOrders'],
		},
	},
	default: '[]',
	description: 'Array of order objects to place',
},
{
	displayName: 'Order IDs',
	name: 'orderIds',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['spotTrading'],
			operation: ['batchCancelOrders'],
		},
	},
	default: '[]',
	description: 'Array of order IDs to cancel',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder', 'getOrder', 'getOpenOrders', 'getOrderHistory', 'cancelOrder', 'getPosition'],
    },
  },
  default: '',
  description: 'Trading symbol (e.g., BTCUSDT)',
},
{
  displayName: 'Margin Coin',
  name: 'marginCoin',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder'],
    },
  },
  default: '',
  description: 'Margin coin symbol (e.g., USDT)',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder'],
    },
  },
  options: [
    { name: 'Buy (Open Long)', value: 'open_long' },
    { name: 'Sell (Open Short)', value: 'open_short' },
    { name: 'Sell (Close Long)', value: 'close_long' },
    { name: 'Buy (Close Short)', value: 'close_short' },
  ],
  default: 'open_long',
  description: 'Order side',
},
{
  displayName: 'Order Type',
  name: 'orderType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder'],
    },
  },
  options: [
    { name: 'Market', value: 'market' },
    { name: 'Limit', value: 'limit' },
  ],
  default: 'limit',
  description: 'Order type',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder'],
    },
  },
  default: '',
  description: 'Order price (required for limit orders)',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['placeOrder'],
    },
  },
  default: '',
  description: 'Order size',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['getOrder', 'cancelOrder'],
    },
  },
  default: '',
  description: 'Order ID',
},
{
  displayName: 'Product Type',
  name: 'productType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['getOpenOrders', 'getOrderHistory', 'getPosition', 'getAllPositions'],
    },
  },
  options: [
    { name: 'USDT-M', value: 'USDT-FUTURES' },
    { name: 'Coin-M', value: 'COIN-FUTURES' },
    { name: 'USDC-M', value: 'USDC-FUTURES' },
  ],
  default: 'USDT-FUTURES',
  description: 'Product type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['futuresTrading'],
      operation: ['getOrderHistory'],
    },
  },
  default: 100,
  description: 'Number of records to return',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getTicker'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Trading pair symbol',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderbook'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Trading pair symbol',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderbook'] } },
  options: [
    { name: 'Step 0', value: 'step0' },
    { name: 'Step 1', value: 'step1' },
    { name: 'Step 2', value: 'step2' },
  ],
  default: 'step0',
  description: 'Orderbook aggregation type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['marketData'], operation: ['getOrderbook'] } },
  default: 100,
  description: 'Number of entries to return',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getCandles'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Trading pair symbol',
},
{
  displayName: 'Granularity',
  name: 'granularity',
  type: 'options',
  displayOptions: { show: { resource: ['marketData'], operation: ['getCandles'] } },
  options: [
    { name: '1 Minute', value: '1m' },
    { name: '5 Minutes', value: '5m' },
    { name: '15 Minutes', value: '15m' },
    { name: '30 Minutes', value: '30m' },
    { name: '1 Hour', value: '1H' },
    { name: '4 Hours', value: '4H' },
    { name: '6 Hours', value: '6H' },
    { name: '12 Hours', value: '12H' },
    { name: '1 Day', value: '1D' },
    { name: '1 Week', value: '1W' },
  ],
  default: '1H',
  description: 'Candlestick time interval',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'dateTime',
  displayOptions: { show: { resource: ['marketData'], operation: ['getCandles'] } },
  default: '',
  description: 'Start time for candlestick data',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'dateTime',
  displayOptions: { show: { resource: ['marketData'], operation: ['getCandles'] } },
  default: '',
  description: 'End time for candlestick data',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Trading pair symbol',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['marketData'], operation: ['getRecentTrades'] } },
  default: 100,
  description: 'Number of trades to return',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getHistoricalTrades'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Trading pair symbol',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['marketData'], operation: ['getHistoricalTrades'] } },
  default: 100,
  description: 'Number of trades to return',
},
{
  displayName: 'ID Less Than',
  name: 'idLessThan',
  type: 'string',
  displayOptions: { show: { resource: ['marketData'], operation: ['getHistoricalTrades'] } },
  default: '',
  description: 'Return trades with ID less than this value',
},
{
  displayName: 'Product Type',
  name: 'productType',
  type: 'options',
  displayOptions: { show: { resource: ['marketData'], operation: ['getFuturesTickers'] } },
  options: [
    { name: 'USDT-M', value: 'USDT-FUTURES' },
    { name: 'Coin-M', value: 'COIN-FUTURES' },
    { name: 'USDC-M', value: 'USDC-FUTURES' },
  ],
  default: 'USDT-FUTURES',
  description: 'Futures product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marketData'], operation: ['getFuturesTicker'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Futures trading pair symbol',
},
{
  displayName: 'Coin',
  name: 'coin',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAssets'] } },
  default: '',
  description: 'The coin symbol to filter assets',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getFuturesAccount'] } },
  default: '',
  description: 'The trading symbol',
},
{
  displayName: 'Product Type',
  name: 'productType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getFuturesAccount', 'getFuturesAccounts'] } },
  options: [
    { name: 'USDT Perpetual', value: 'USDT-FUTURES' },
    { name: 'COIN Perpetual', value: 'COIN-FUTURES' },
    { name: 'USDC Perpetual', value: 'USDC-FUTURES' },
  ],
  default: 'USDT-FUTURES',
  description: 'The product type for futures account',
},
{
  displayName: 'From Type',
  name: 'fromType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['transfer'] } },
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'USDT Futures', value: 'mix_usdt' },
    { name: 'COIN Futures', value: 'mix_usd' },
    { name: 'USDC Futures', value: 'mix_usdc' },
  ],
  default: 'spot',
  description: 'Transfer from account type',
},
{
  displayName: 'To Type',
  name: 'toType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['transfer'] } },
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'USDT Futures', value: 'mix_usdt' },
    { name: 'COIN Futures', value: 'mix_usd' },
    { name: 'USDC Futures', value: 'mix_usdc' },
  ],
  default: 'mix_usdt',
  description: 'Transfer to account type',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['transfer'] } },
  default: '',
  description: 'Transfer amount',
},
{
  displayName: 'Coin',
  name: 'transferCoin',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['transfer'] } },
  default: '',
  description: 'The coin to transfer',
},
{
  displayName: 'Coin',
  name: 'historyCoin',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getTransferHistory'] } },
  default: '',
  description: 'The coin symbol to filter transfer history',
},
{
  displayName: 'From Type',
  name: 'historyFromType',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getTransferHistory'] } },
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'USDT Futures', value: 'mix_usdt' },
    { name: 'COIN Futures', value: 'mix_usd' },
    { name: 'USDC Futures', value: 'mix_usdc' },
  ],
  default: 'spot',
  description: 'Filter by from account type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getTransferHistory'] } },
  default: 100,
  description: 'Maximum number of records to return',
},
{
  displayName: 'Coin',
  name: 'billsCoin',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getBills'] } },
  default: '',
  description: 'The coin symbol to filter bills',
},
{
  displayName: 'Group Type',
  name: 'groupType',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getBills'] } },
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Margin', value: 'margin' },
    { name: 'Futures', value: 'futures' },
  ],
  default: 'spot',
  description: 'The group type for bills',
},
{
  displayName: 'Business Type',
  name: 'businessType',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getBills'] } },
  default: '',
  description: 'The business type to filter bills',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['getCurrentCopyOrders', 'getCopyOrderHistory', 'closeCopyPosition', 'getFollowerOrders', 'setTpSl']
    }
  },
  default: '',
  description: 'Trading pair symbol (e.g., BTCUSDT)',
},
{
  displayName: 'Product Type',
  name: 'productType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['getCurrentCopyOrders', 'getCopyOrderHistory', 'getFollowerOrders']
    }
  },
  options: [
    { name: 'UMCBL', value: 'UMCBL' },
    { name: 'DMCBL', value: 'DMCBL' },
    { name: 'CMCBL', value: 'CMCBL' }
  ],
  default: 'UMCBL',
  description: 'Product type for the trading pair',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['getCopyOrderHistory', 'getProfitHistory']
    }
  },
  default: 100,
  description: 'Number of records to return (default: 100)',
},
{
  displayName: 'Tracking Number',
  name: 'trackingNo',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['closeCopyPosition']
    }
  },
  default: '',
  description: 'Tracking number of the position to close',
},
{
  displayName: 'After',
  name: 'after',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['getProfitHistory']
    }
  },
  default: '',
  description: 'Query data after this timestamp',
},
{
  displayName: 'Before',
  name: 'before',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['getProfitHistory']
    }
  },
  default: '',
  description: 'Query data before this timestamp',
},
{
  displayName: 'Take Profit Stop Loss',
  name: 'tpsl',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['copyTrading'],
      operation: ['setTpSl']
    }
  },
  default: '{}',
  description: 'Take profit and stop loss configuration as JSON object',
},
{
	displayName: 'Coin',
	name: 'coin',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['earnProducts'],
			operation: ['getSavingsProducts', 'getSavingsAssets', 'getSharkfinProducts'],
		},
	},
	default: '',
	description: 'The coin symbol to filter products',
},
{
	displayName: 'Product ID',
	name: 'productId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['earnProducts'],
			operation: ['subscribeSavings', 'redeemSavings', 'getSavingsAccount', 'getSavingsHistory'],
		},
	},
	default: '',
	description: 'The ID of the savings product',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['earnProducts'],
			operation: ['subscribeSavings', 'redeemSavings'],
		},
	},
	default: '',
	description: 'The amount to subscribe or redeem',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['earnProducts'],
			operation: ['getSavingsHistory'],
		},
	},
	default: 20,
	description: 'Number of records to return (max 100)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'spotTrading':
        return [await executeSpotTradingOperations.call(this, items)];
      case 'futuresTrading':
        return [await executeFuturesTradingOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'copyTrading':
        return [await executeCopyTradingOperations.call(this, items)];
      case 'earnProducts':
        return [await executeEarnProductsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeSpotTradingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bitgetexchangeApi') as any;

	function createSignature(timestamp: string, method: string, requestPath: string, body: string, secretKey: string): string {
		const prehash = timestamp + method + requestPath + body;
		return crypto.createHmac('sha256', secretKey).update(prehash).digest('base64');
	}

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const timestamp = Date.now().toString();
			let method = 'GET';
			let endpoint = '';
			let body = '';
			let queryParams: any = {};

			switch (operation) {
				case 'placeOrder': {
					method = 'POST';
					endpoint = '/api/v2/spot/trade/place-order';
					const symbol = this.getNodeParameter('symbol', i) as string;
					const side = this.getNodeParameter('side', i) as string;
					const orderType = this.getNodeParameter('orderType', i) as string;
					const quantity = this.getNodeParameter('quantity', i) as string;
					const price = this.getNodeParameter('price', i) as string;
					const force = this.getNodeParameter('force', i) as string;

					const orderData: any = {
						symbol,
						side,
						orderType,
						quantity,
						force,
					};

					if (orderType === 'limit' && price) {
						orderData.price = price;
					}

					body = JSON.stringify(orderData);
					break;
				}
				case 'getOrder': {
					method = 'GET';
					endpoint = '/api/v2/spot/trade/orderInfo';
					queryParams = {
						symbol: this.getNodeParameter('symbol', i) as string,
						orderId: this.getNodeParameter('orderId', i) as string,
					};
					break;
				}
				case 'getOpenOrders': {
					method = 'GET';
					endpoint = '/api/v2/spot/trade/open-orders';
					queryParams = {
						symbol: this.getNodeParameter('symbol', i) as string,
					};
					const limit = this.getNodeParameter('limit', i) as number;
					if (limit) queryParams.limit = limit;
					break;
				}
				case 'getOrderHistory': {
					method = 'GET';
					endpoint = '/api/v2/spot/trade/history';
					queryParams = {
						symbol: this.getNodeParameter('symbol', i) as string,
					};
					const limit = this.getNodeParameter('limit', i) as number;
					const after = this.getNodeParameter('after', i) as string;
					const before = this.getNodeParameter('before', i) as string;
					if (limit) queryParams.limit = limit;
					if (after) queryParams.after = after;
					if (before) queryParams.before = before;
					break;
				}
				case 'cancelOrder': {
					method = 'POST';
					endpoint = '/api/v2/spot/trade/cancel-order';
					body = JSON.stringify({
						symbol: this.getNodeParameter('symbol', i) as string,
						orderId: this.getNodeParameter('orderId', i) as string,
					});
					break;
				}
				case 'batchPlaceOrders': {
					method = 'POST';
					endpoint = '/api/v2/spot/trade/batch-orders';
					body = JSON.stringify({
						symbol: this.getNodeParameter('symbol', i) as string,
						orderList: JSON.parse(this.getNodeParameter('orderList', i) as string),
					});
					break;
				}
				case 'batchCancelOrders': {
					method = 'POST';
					endpoint = '/api/v2/spot/trade/batch-cancel-order';
					body = JSON.stringify({
						symbol: this.getNodeParameter('symbol', i) as string,
						orderIds: JSON.parse(this.getNodeParameter('orderIds', i) as string),
					});
					break;
				}
				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			const queryString = new URLSearchParams(queryParams).toString();
			const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
			const signature = createSignature(timestamp, method, fullEndpoint, body, credentials.secretKey);

			const options: any = {
				method,
				url: `${credentials.baseUrl}${fullEndpoint}`,
				headers: {
					'ACCESS-KEY': credentials.apiKey,
					'ACCESS-SIGN': signature,
					'ACCESS-TIMESTAMP': timestamp,
					'ACCESS-PASSPHRASE': credentials.passphrase,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			if (body) {
				options.body = body;
			}

			result = await this.helpers.httpRequest(options) as any;

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFuturesTradingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitgetexchangeApi') as any;

  function createSignature(timestamp: string, method: string, requestPath: string, body: string): string {
    const prehash = timestamp + method.toUpperCase() + requestPath + body;
    return crypto.createHmac('sha256', credentials.secretKey).update(prehash).digest('base64');
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      let endpoint = '';
      let method = 'GET';
      let body = '';
      let queryParams = '';

      switch (operation) {
        case 'placeOrder': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const marginCoin = this.getNodeParameter('marginCoin', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const orderType = this.getNodeParameter('orderType', i) as string;
          const price = this.getNodeParameter('price', i) as string;
          const size = this.getNodeParameter('size', i) as string;

          endpoint = '/api/v2/mix/order/place-order';
          method = 'POST';
          const requestBody = {
            symbol,
            marginCoin,
            side,
            orderType,
            size,
          };
          if (orderType === 'limit' && price) {
            (requestBody as any).price = price;
          }
          body = JSON.stringify(requestBody);
          break;
        }

        case 'getOrder': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          endpoint = '/api/v2/mix/order/detail';
          queryParams = `?symbol=${symbol}&orderId=${orderId}`;
          break;
        }

        case 'getOpenOrders': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          endpoint = '/api/v2/mix/order/current';
          queryParams = `?symbol=${symbol}&productType=${productType}`;
          break;
        }

        case 'getOrderHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          endpoint = '/api/v2/mix/order/history';
          queryParams = `?symbol=${symbol}&productType=${productType}&limit=${limit}`;
          break;
        }

        case 'cancelOrder': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          endpoint = '/api/v2/mix/order/cancel-order';
          method = 'POST';
          body = JSON.stringify({ symbol, orderId });
          break;
        }

        case 'getPosition': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          endpoint = '/api/v2/mix/position/single-position';
          queryParams = `?symbol=${symbol}&productType=${productType}`;
          break;
        }

        case 'getAllPositions': {
          const productType = this.getNodeParameter('productType', i) as string;
          const marginCoin = this.getNodeParameter('marginCoin', i, '') as string;
          endpoint = '/api/v2/mix/position/all-position';
          queryParams = `?productType=${productType}`;
          if (marginCoin) {
            queryParams += `&marginCoin=${marginCoin}`;
          }
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      const requestPath = endpoint + queryParams;
      const signature = createSignature(timestamp, method, requestPath, body);

      const options: any = {
        method,
        url: credentials.baseUrl + requestPath,
        headers: {
          'ACCESS-KEY': credentials.apiKey,
          'ACCESS-SIGN': signature,
          'ACCESS-TIMESTAMP': timestamp,
          'ACCESS-PASSPHRASE': credentials.passphrase,
          'Content-Type': 'application/json',
        },
        json: true,
      };

      if (method === 'POST' && body) {
        options.body = body;
      }

      result = await this.helpers.httpRequest(options) as any;
      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}

async function executeMarketDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitgetexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTickers': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/tickers`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTicker': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/ticker`,
            qs: { symbol },
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderbook': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/orderbook`,
            qs: { symbol, type, limit },
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCandles': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const granularity = this.getNodeParameter('granularity', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as string;
          const endTime = this.getNodeParameter('endTime', i) as string;
          
          const queryParams: any = { symbol, granularity };
          if (startTime) queryParams.startTime = new Date(startTime).getTime().toString();
          if (endTime) queryParams.endTime = new Date(endTime).getTime().toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/candles`,
            qs: queryParams,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRecentTrades': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/recent-trades`,
            qs: { symbol, limit },
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getHistoricalTrades': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const idLessThan = this.getNodeParameter('idLessThan', i) as string;
          
          const queryParams: any = { symbol, limit };
          if (idLessThan) queryParams.idLessThan = idLessThan;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/market/history-trades`,
            qs: queryParams,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesTickers': {
          const productType = this.getNodeParameter('productType', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/mix/market/tickers`,
            qs: { productType },
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesTicker': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/mix/market/ticker`,
            qs: { symbol },
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitgetexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccountInfo': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/spot/account/info`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAssets': {
          const coin = this.getNodeParameter('coin', i) as string;
          let url = `${credentials.baseUrl}/api/v2/spot/account/assets`;
          if (coin) {
            url += `?coin=${coin}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesAccount': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          let url = `${credentials.baseUrl}/api/v2/mix/account/account?productType=${productType}`;
          if (symbol) {
            url += `&symbol=${symbol}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesAccounts': {
          const productType = this.getNodeParameter('productType', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/mix/account/accounts?productType=${productType}`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transfer': {
          const fromType = this.getNodeParameter('fromType', i) as string;
          const toType = this.getNodeParameter('toType', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const coin = this.getNodeParameter('transferCoin', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v2/spot/wallet/transfer`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            body: {
              fromType,
              toType,
              amount,
              coin,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransferHistory': {
          const coin = this.getNodeParameter('historyCoin', i) as string;
          const fromType = this.getNodeParameter('historyFromType', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          
          let url = `${credentials.baseUrl}/api/v2/spot/account/transferRecords?`;
          const params = [];
          if (coin) params.push(`coin=${coin}`);
          if (fromType) params.push(`fromType=${fromType}`);
          if (limit) params.push(`limit=${limit}`);
          url += params.join('&');
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBills': {
          const coin = this.getNodeParameter('billsCoin', i) as string;
          const groupType = this.getNodeParameter('groupType', i) as string;
          const businessType = this.getNodeParameter('businessType', i) as string;
          
          let url = `${credentials.baseUrl}/api/v2/spot/account/bills?`;
          const params = [];
          if (coin) params.push(`coin=${coin}`);
          if (groupType) params.push(`groupType=${groupType}`);
          if (businessType) params.push(`businessType=${businessType}`);
          url += params.join('&');
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'ACCESS-TIMESTAMP': Date.now().toString(),
              'locale': 'en-US',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCopyTradingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bitgetexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();

      switch (operation) {
        case 'getCurrentCopyOrders': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('symbol', symbol);
          queryParams.append('productType', productType);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/copy/mix-trader/order-current-track?${queryParams.toString()}`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCopyOrderHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const productType = this.getNodeParameter('productType', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('symbol', symbol);
          queryParams.append('productType', productType);
          queryParams.append('limit', limit.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/copy/mix-trader/order-history-track?${queryParams.toString()}`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'closeCopyPosition': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const trackingNo = this.getNodeParameter('trackingNo', i) as string;
          
          const body = {
            symbol,
            trackingNo,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v2/copy/mix-trader/order-close-tracking`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProfitSummary': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/copy/mix-trader/profit-summary-date`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProfitHistory': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const after = this.getNodeParameter('after', i, '') as string;
          const before = this.getNodeParameter('before', i, '') as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          if (after) queryParams.append('after', after);
          if (before) queryParams.append('before', before);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/copy/mix-trader/profit-history-summarys?${queryParams.toString()}`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFollowerOrders': {
          const productType = this.getNodeParameter('productType', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('productType', productType);
          queryParams.append('symbol', symbol);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v2/copy/mix-follower/query-current-orders?${queryParams.toString()}`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'setTpSl': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const tpsl = this.getNodeParameter('tpsl', i) as object;
          
          const body = {
            symbol,
            tpsl,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v2/copy/mix-follower/setting-tpsl`,
            headers: {
              'ACCESS-KEY': credentials.apiKey,
              'ACCESS-SIGN': credentials.secretKey,
              'ACCESS-TIMESTAMP': timestamp,
              'ACCESS-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeEarnProductsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bitgetexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			let endpoint: string;
			let method: string;
			let body: any = {};
			const params: any = {};

			switch (operation) {
				case 'getSavingsProducts': {
					const coin = this.getNodeParameter('coin', i) as string;
					endpoint = '/api/v2/earn/savings/product';
					method = 'GET';
					if (coin) {
						params.coin = coin;
					}
					break;
				}

				case 'subscribeSavings': {
					const productId = this.getNodeParameter('productId', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					endpoint = '/api/v2/earn/savings/subscribe';
					method = 'POST';
					body = {
						productId,
						amount,
					};
					break;
				}

				case 'redeemSavings': {
					const productId = this.getNodeParameter('productId', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					endpoint = '/api/v2/earn/savings/redeem';
					method = 'POST';
					body = {
						productId,
						amount,
					};
					break;
				}

				case 'getSavingsAccount': {
					const productId = this.getNodeParameter('productId', i) as string;
					endpoint = '/api/v2/earn/savings/account';
					method = 'GET';
					params.productId = productId;
					break;
				}

				case 'getSavingsAssets': {
					const coin = this.getNodeParameter('coin', i) as string;
					endpoint = '/api/v2/earn/savings/assets';
					method = 'GET';
					if (coin) {
						params.coin = coin;
					}
					break;
				}

				case 'getSavingsHistory': {
					const productId = this.getNodeParameter('productId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					endpoint = '/api/v2/earn/savings/records';
					method = 'GET';
					params.productId = productId;
					if (limit) {
						params.limit = limit.toString();
					}
					break;
				}

				case 'getSharkfinProducts': {
					const coin = this.getNodeParameter('coin', i) as string;
					endpoint = '/api/v2/earn/sharkfin/product';
					method = 'GET';
					if (coin) {
						params.coin = coin;
					}
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			const timestamp = Date.now().toString();
			const queryString = Object.keys(params).length > 0 
				? '?' + new URLSearchParams(params).toString()
				: '';
			
			const options: IHttpRequestOptions = {
				method,
				url: `${credentials.baseUrl}${endpoint}${queryString}`,
				headers: {
					'ACCESS-KEY': credentials.apiKey,
					'ACCESS-SIGN': credentials.secretKey,
					'ACCESS-TIMESTAMP': timestamp,
					'ACCESS-PASSPHRASE': credentials.passphrase,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			if (method === 'POST' && Object.keys(body).length > 0) {
				options.body = body;
			}

			result = await this.helpers.httpRequest(options) as any;
			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
