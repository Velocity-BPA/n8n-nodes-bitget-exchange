/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { BitgetExchange } from '../nodes/Bitget Exchange/Bitget Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('BitgetExchange Node', () => {
  let node: BitgetExchange;

  beforeAll(() => {
    node = new BitgetExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Bitget Exchange');
      expect(node.description.name).toBe('bitgetexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('SpotTrading Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				secretKey: 'test-secret',
				passphrase: 'test-passphrase',
				baseUrl: 'https://api.bitget.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('placeOrder operation', () => {
		it('should place a limit order successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('placeOrder')
				.mockReturnValueOnce('BTCUSDT')
				.mockReturnValueOnce('buy')
				.mockReturnValueOnce('limit')
				.mockReturnValueOnce('1.0')
				.mockReturnValueOnce('45000')
				.mockReturnValueOnce('gtc');

			const mockResponse = { code: '00000', data: { orderId: '12345' } };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSpotTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle errors when placing order', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('placeOrder')
				.mockReturnValueOnce('BTCUSDT')
				.mockReturnValueOnce('buy')
				.mockReturnValueOnce('limit')
				.mockReturnValueOnce('1.0')
				.mockReturnValueOnce('45000')
				.mockReturnValueOnce('gtc');

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeSpotTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getOrder operation', () => {
		it('should get order details successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrder')
				.mockReturnValueOnce('BTCUSDT')
				.mockReturnValueOnce('12345');

			const mockResponse = { code: '00000', data: { orderId: '12345', status: 'filled' } };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSpotTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('cancelOrder operation', () => {
		it('should cancel order successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelOrder')
				.mockReturnValueOnce('BTCUSDT')
				.mockReturnValueOnce('12345');

			const mockResponse = { code: '00000', data: { orderId: '12345' } };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSpotTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('FuturesTrading Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.bitget.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  test('should place futures order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('placeOrder')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('USDT')
      .mockReturnValueOnce('open_long')
      .mockReturnValueOnce('limit')
      .mockReturnValueOnce('50000')
      .mockReturnValueOnce('0.001');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: { orderId: '123456789' }
    });

    const result = await executeFuturesTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.orderId).toBe('123456789');
  });

  test('should get order details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrder')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('123456789');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: { orderId: '123456789', status: 'filled' }
    });

    const result = await executeFuturesTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.orderId).toBe('123456789');
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('placeOrder');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeFuturesTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should get all positions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllPositions')
      .mockReturnValueOnce('USDT-FUTURES')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: [{ symbol: 'BTCUSDT', size: '0.1' }]
    });

    const result = await executeFuturesTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data).toHaveLength(1);
  });

  test('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('123456789');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: { orderId: '123456789', result: 'success' }
    });

    const result = await executeFuturesTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.result).toBe('success');
  });
});

describe('MarketData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.bitget.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTickers operation', () => {
    it('should get all spot tickers successfully', async () => {
      const mockResponse = { data: [{ symbol: 'BTCUSDT', price: '50000' }] };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTickers');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.bitget.com/api/v2/spot/market/tickers',
        headers: {
          'ACCESS-KEY': 'test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getTickers error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTickers');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTicker operation', () => {
    it('should get single ticker successfully', async () => {
      const mockResponse = { data: { symbol: 'BTCUSDT', price: '50000' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTicker')
        .mockReturnValueOnce('BTCUSDT');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrderbook operation', () => {
    it('should get orderbook data successfully', async () => {
      const mockResponse = { data: { asks: [], bids: [] } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOrderbook')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('step0')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCandles operation', () => {
    it('should get candlestick data successfully', async () => {
      const mockResponse = { data: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCandles')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('1H')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getFuturesTickers operation', () => {
    it('should get futures tickers successfully', async () => {
      const mockResponse = { data: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFuturesTickers')
        .mockReturnValueOnce('USDT-FUTURES');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMarketDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.bitget.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get account info successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountInfo');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: { userId: '123', nickName: 'test' }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('00000');
  });

  it('should handle account info error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountInfo');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get assets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAssets')
      .mockReturnValueOnce('BTC');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: [{ coin: 'BTC', available: '1.5' }]
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data).toBeDefined();
  });

  it('should transfer funds successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('transfer')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('mix_usdt')
      .mockReturnValueOnce('100')
      .mockReturnValueOnce('USDT');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '00000',
      data: { transferId: '123456' }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('00000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          fromType: 'spot',
          toType: 'mix_usdt',
          amount: '100',
          coin: 'USDT'
        })
      })
    );
  });
});

describe('CopyTrading Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.bitget.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getCurrentCopyOrders', () => {
    it('should get current copy orders successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentCopyOrders')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('UMCBL');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
        code: '00000', 
        data: [{ orderId: '123', symbol: 'BTCUSDT' }] 
      });

      const result = await executeCopyTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.data).toBeDefined();
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/api/v2/copy/mix-trader/order-current-track'),
        })
      );
    });

    it('should handle getCurrentCopyOrders error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentCopyOrders')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('UMCBL');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCopyTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('closeCopyPosition', () => {
    it('should close copy position successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('closeCopyPosition')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('track123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
        code: '00000', 
        msg: 'success' 
      });

      const result = await executeCopyTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.msg).toBe('success');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/api/v2/copy/mix-trader/order-close-tracking'),
        })
      );
    });
  });

  describe('setTpSl', () => {
    it('should set take profit stop loss successfully', async () => {
      const tpslConfig = { tp: '50000', sl: '45000' };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('setTpSl')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce(tpslConfig);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
        code: '00000', 
        msg: 'success' 
      });

      const result = await executeCopyTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.msg).toBe('success');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/api/v2/copy/mix-follower/setting-tpsl'),
          body: expect.objectContaining({
            symbol: 'BTCUSDT',
            tpsl: tpslConfig
          })
        })
      );
    });
  });
});

describe('EarnProducts Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				secretKey: 'test-secret',
				passphrase: 'test-passphrase',
				baseUrl: 'https://api.bitget.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get savings products successfully', async () => {
		const mockResponse = {
			code: '00000',
			data: [
				{
					productId: 'SP001',
					coin: 'USDT',
					minAmount: '100',
					interestRate: '0.05',
				},
			],
		};

		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSavingsProducts';
			if (param === 'coin') return 'USDT';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeEarnProductsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://api.bitget.com/api/v2/earn/savings/product?coin=USDT',
			}),
		);
	});

	it('should subscribe to savings product successfully', async () => {
		const mockResponse = {
			code: '00000',
			data: {
				orderId: 'SO001',
				status: 'success',
			},
		};

		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'subscribeSavings';
			if (param === 'productId') return 'SP001';
			if (param === 'amount') return '1000';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeEarnProductsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.bitget.com/api/v2/earn/savings/subscribe',
				body: {
					productId: 'SP001',
					amount: '1000',
				},
			}),
		);
	});

	it('should handle errors when operation fails', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSavingsProducts';
		});

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const items = [{ json: {} }];
		const result = await executeEarnProductsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('error');
		expect(result[0].json.error).toBe('API Error');
	});

	it('should redeem from savings product successfully', async () => {
		const mockResponse = {
			code: '00000',
			data: {
				orderId: 'RO001',
				status: 'success',
			},
		};

		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'redeemSavings';
			if (param === 'productId') return 'SP001';
			if (param === 'amount') return '500';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeEarnProductsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.bitget.com/api/v2/earn/savings/redeem',
				body: {
					productId: 'SP001',
					amount: '500',
				},
			}),
		);
	});

	it('should get savings history successfully', async () => {
		const mockResponse = {
			code: '00000',
			data: [
				{
					orderId: 'SO001',
					type: 'subscribe',
					amount: '1000',
					createTime: '1640995200000',
				},
			],
		};

		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getSavingsHistory';
			if (param === 'productId') return 'SP001';
			if (param === 'limit') return 50;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeEarnProductsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://api.bitget.com/api/v2/earn/savings/records?productId=SP001&limit=50',
			}),
		);
	});
});
});
