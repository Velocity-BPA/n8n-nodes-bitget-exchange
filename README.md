# n8n-nodes-bitget-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Bitget cryptocurrency exchange. This node provides comprehensive access to 6 core resources including spot trading, futures trading, market data, account management, copy trading, and earn products, enabling automated trading strategies and portfolio management workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Crypto Trading](https://img.shields.io/badge/Crypto-Trading-orange)
![Bitget API](https://img.shields.io/badge/Bitget-API-green)
![Exchange Integration](https://img.shields.io/badge/Exchange-Integration-purple)

## Features

- **Spot Trading** - Execute buy/sell orders, manage positions, and track order history on spot markets
- **Futures Trading** - Access derivatives trading with leverage, manage futures positions and orders
- **Real-time Market Data** - Retrieve live prices, order books, trading volumes, and market statistics
- **Account Management** - Monitor balances, transaction history, and account information across all trading pairs
- **Copy Trading** - Automate trading by following successful traders and managing copy trading positions
- **Earn Products** - Access staking, savings, and other yield-generating products for passive income
- **Comprehensive Error Handling** - Robust error management with detailed API response handling
- **Rate Limit Compliance** - Built-in rate limiting to ensure API usage stays within Bitget's limits

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bitget-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-bitget-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-bitget-exchange.git
cd n8n-nodes-bitget-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bitget-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Bitget API key from the API management section | Yes |
| Secret Key | Your Bitget secret key for request signing | Yes |
| Passphrase | API passphrase configured during key creation | Yes |
| Environment | Choose between 'production' or 'sandbox' for testing | Yes |

## Resources & Operations

### 1. SpotTrading

| Operation | Description |
|-----------|-------------|
| Place Order | Create a new spot trading order (buy/sell) |
| Cancel Order | Cancel an existing order by order ID |
| Get Order | Retrieve details of a specific order |
| List Orders | Get list of orders with optional filtering |
| Get Order History | Retrieve historical order data |
| List Trades | Get executed trade history |
| Get Account Balance | Retrieve spot account balances |

### 2. FuturesTrading

| Operation | Description |
|-----------|-------------|
| Place Order | Create a new futures trading order |
| Cancel Order | Cancel an existing futures order |
| Get Order | Retrieve futures order details |
| List Orders | Get list of futures orders |
| Get Positions | Retrieve current futures positions |
| Close Position | Close an open futures position |
| Set Leverage | Adjust leverage for a trading pair |
| Get Account Info | Retrieve futures account information |

### 3. MarketData

| Operation | Description |
|-----------|-------------|
| Get Ticker | Retrieve current price ticker for symbols |
| Get Order Book | Get order book depth data |
| Get Recent Trades | Fetch recent trade executions |
| Get Candlestick Data | Retrieve OHLCV candlestick data |
| Get 24hr Statistics | Get 24-hour trading statistics |
| List Trading Pairs | Retrieve available trading pairs |
| Get Market Summary | Get comprehensive market overview |

### 4. Account

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve general account information |
| Get Balances | Get account balances across all assets |
| Get Deposit Address | Generate or retrieve deposit addresses |
| Get Deposit History | Retrieve deposit transaction history |
| Get Withdrawal History | Get withdrawal transaction records |
| Transfer Funds | Transfer between spot, futures, and other accounts |
| Get Transfer History | Retrieve internal transfer history |

### 5. CopyTrading

| Operation | Description |
|-----------|-------------|
| Get Traders List | Retrieve list of available copy traders |
| Follow Trader | Start copying a specific trader |
| Unfollow Trader | Stop copying a trader |
| Get Copy Positions | Retrieve current copy trading positions |
| Get Copy History | Get copy trading transaction history |
| Update Copy Settings | Modify copy trading parameters |
| Get Performance Stats | Retrieve copy trading performance metrics |

### 6. EarnProducts

| Operation | Description |
|-----------|-------------|
| List Products | Get available earn/staking products |
| Subscribe Product | Subscribe to an earn product |
| Redeem Product | Redeem from an earn product |
| Get Holdings | Retrieve current earn product holdings |
| Get Earn History | Get earn product transaction history |
| Get Product Details | Retrieve detailed product information |
| Calculate Returns | Calculate potential returns for products |

## Usage Examples

```javascript
// Place a spot buy order for BTC/USDT
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "limit",
  "size": "0.001",
  "price": "45000",
  "timeInForce": "GTC"
}
```

```javascript
// Get real-time market data for multiple symbols
{
  "symbols": ["BTCUSDT", "ETHUSDT", "ADAUSDT"],
  "dataType": "ticker"
}
```

```javascript
// Retrieve account balances with minimum threshold
{
  "currency": "all",
  "minBalance": "0.01"
}
```

```javascript
// Follow a copy trader with custom settings
{
  "traderId": "123456",
  "copyAmount": "1000",
  "copyRatio": "0.1",
  "maxPositions": "5"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | API credentials are incorrect or expired | Verify API key, secret, and passphrase in credentials |
| Insufficient Balance | Account lacks funds for the operation | Check account balance and deposit funds if needed |
| Rate Limit Exceeded | Too many API requests in time window | Implement delays between requests or reduce frequency |
| Invalid Symbol | Trading pair is not supported or incorrect format | Verify symbol format matches Bitget's requirements |
| Order Not Found | Specified order ID does not exist | Check order ID and ensure order hasn't been cancelled |
| Market Closed | Trading is not available for the symbol | Check market hours and trading availability |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bitget-exchange/issues)
- **Bitget API Documentation**: [Bitget API Docs](https://bitgetlimited.github.io/apidoc/en/mix/)
- **Bitget Support**: [Bitget Help Center](https://www.bitget.com/support)