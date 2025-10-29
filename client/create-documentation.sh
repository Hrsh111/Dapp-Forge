#!/bin/bash

echo "📚 Creating all documentation pages..."

# Create main index page
cat > src/pages/index.mdx << 'INDEXEOF'
# Dapp-Forge Documentation

Welcome to **Dapp-Forge** - A decentralized exchange (DEX) platform built on Ethereum blockchain technology.

## What is Dapp-Forge?

Dapp-Forge is a fully decentralized application that enables peer-to-peer token trading without intermediaries. By leveraging blockchain technology, it provides:

- 🔒 **Security** - Smart contract-based trading with no central authority
- 🌐 **Transparency** - All transactions are publicly verifiable on the blockchain
- 💰 **Control** - Users maintain full custody of their assets
- ⚡ **Efficiency** - Direct trading without intermediaries
- 📊 **Real-time** - Live order books and price charts

## Quick Start
```bash
# Clone the repository
git clone https://github.com/Hrsh111/Dapp-Forge.git

# Navigate to client directory
cd Dapp-Forge/client

# Install dependencies
npm install

# Start the development server
npm start
```

## Features

### Trading Features
- **Order Book System** - View and execute limit orders
- **Real-time Price Charts** - Track token prices with ApexCharts
- **Trade History** - Complete transaction history
- **Balance Management** - Track ETH and token balances

### Technical Features
- **Web3 Integration** - MetaMask wallet support
- **Redux State Management** - Efficient state handling
- **React Components** - Modern, responsive UI
- **Smart Contracts** - Auditable exchange logic

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Bootstrap 5
- **Blockchain**: Ethereum, Web3.js, Smart Contracts
- **Charts**: ApexCharts for real-time visualization
- **State**: Redux with Redux Thunk

## Get Started

- [Getting Started](/getting-started) - Installation and setup
- [Architecture](/architecture) - System design
- [Smart Contracts](/smart-contracts) - Contract documentation
- [API Reference](/api-reference) - Complete API docs
INDEXEOF

echo "✅ Created index.mdx"

# Create _meta.json for main navigation
cat > src/pages/_meta.json << 'METAEOF'
{
  "index": {
    "title": "Introduction",
    "theme": {
      "breadcrumb": false,
      "footer": true,
      "sidebar": true,
      "toc": true,
      "pagination": true
    }
  },
  "getting-started": {
    "title": "Getting Started"
  },
  "architecture": {
    "title": "Architecture"
  },
  "smart-contracts": {
    "title": "Smart Contracts"
  },
  "frontend": {
    "title": "Frontend Components"
  },
  "state-management": {
    "title": "State Management"
  },
  "api-reference": {
    "title": "API Reference"
  },
  "guides": {
    "title": "Guides"
  },
  "deployment": {
    "title": "Deployment"
  }
}
METAEOF

echo "✅ Created main _meta.json"


# Create Getting Started page
cat > src/pages/getting-started/index.mdx << 'GETSTARTEDEOF'
# Getting Started

This guide will help you set up Dapp-Forge on your local machine.

## Prerequisites

- **Node.js** (v16.0 or higher)
- **npm** (v7.0 or higher)
- **MetaMask** browser extension

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Hrsh111/Dapp-Forge.git
cd Dapp-Forge/client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Configuration

### MetaMask Setup

1. Install MetaMask extension
2. Create or import a wallet
3. Connect to your preferred network
4. Get test ETH from faucets (for testnets)

## Next Steps

- [Architecture](/architecture) - Understand the system
- [Smart Contracts](/smart-contracts) - Learn about contracts
- [API Reference](/api-reference) - Browse the API
GETSTARTEDEOF

cat > src/pages/getting-started/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

echo "✅ Created getting-started documentation"


# Create Architecture page
cat > src/pages/architecture/index.mdx << 'ARCHEOF'
# Architecture Overview

Dapp-Forge follows a modern decentralized application architecture.

## System Architecture
```
┌─────────────────────────────────────┐
│        Frontend (React)             │
│  - Components  - Redux  - Web3     │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Web3 Provider (MetaMask)       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│   Smart Contracts (Ethereum)        │
│  - Exchange.sol  - Token.sol        │
└─────────────────────────────────────┘
```

## Technology Stack

### Frontend
- React 18
- Redux Toolkit
- Bootstrap 5
- ApexCharts

### Blockchain
- Ethereum
- Web3.js
- Solidity Smart Contracts

## Component Structure

- **Navbar** - Navigation and wallet info
- **Balance** - Token and ETH balances
- **OrderBook** - Buy/sell orders
- **PriceChart** - Trading charts
- **Trades** - Transaction history

## Data Flow

1. User interacts with component
2. Action dispatched to Redux
3. Middleware processes (Thunk)
4. Web3 calls smart contract
5. State updated
6. UI re-renders
ARCHEOF

cat > src/pages/architecture/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

echo "✅ Created architecture documentation"


# Create Smart Contracts page
cat > src/pages/smart-contracts/index.mdx << 'CONTRACTSEOF'
# Smart Contracts

Dapp-Forge uses Ethereum smart contracts for decentralized trading.

## Exchange Contract

The core contract managing all trading operations.

### Key Functions

#### makeOrder()

Create a new limit order.
```solidity
function makeOrder(
    address _tokenGet,
    uint256 _amountGet,
    address _tokenGive,
    uint256 _amountGive
) public
```

**Usage:**
```javascript
await exchange.methods.makeOrder(
  tokenAddress,
  web3.utils.toWei('10', 'ether'),
  ETHER_ADDRESS,
  web3.utils.toWei('1', 'ether')
).send({ from: account })
```

#### fillOrder()

Execute an existing order.
```solidity
function fillOrder(uint256 _id) public
```

#### cancelOrder()

Cancel your own order.
```solidity
function cancelOrder(uint256 _id) public
```

## Token Contract

Standard ERC-20 token implementation.

### Functions

- `transfer()` - Transfer tokens
- `approve()` - Approve spending
- `balanceOf()` - Check balance
- `allowance()` - Check allowance

## Events

- **Order** - New order created
- **Trade** - Order filled
- **Cancel** - Order cancelled
- **Deposit** - Funds deposited
- **Withdraw** - Funds withdrawn
CONTRACTSEOF

cat > src/pages/smart-contracts/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

echo "✅ Created smart-contracts documentation"


# Create Frontend page
cat > src/pages/frontend/index.mdx << 'FRONTEOF'
# Frontend Components

React components for the Dapp-Forge interface.

## Core Components

### Navbar
Top navigation with wallet connection.

### Balance
Displays token and ETH balances.

### OrderBook
Shows buy and sell orders.

### PriceChart
Interactive trading chart.

### Trades
Recent transaction history.

### NewOrder
Form for creating orders.

## Usage
```jsx
import { Balance, OrderBook, Trades } from './components'

function App() {
  return (
    <div>
      <Balance />
      <OrderBook />
      <Trades />
    </div>
  )
}
```
FRONTEOF

cat > src/pages/frontend/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

# Create State Management page
cat > src/pages/state-management/index.mdx << 'STATEEOF'
# State Management

Redux setup and patterns in Dapp-Forge.

## Store Structure
```javascript
{
  web3: {
    connection: Web3Instance,
    account: "0x...",
    networkId: 1
  },
  token: {
    loaded: true,
    contract: TokenContract
  },
  exchange: {
    loaded: true,
    contract: ExchangeContract,
    orders: []
  }
}
```

## Actions
```javascript
// Load Web3
dispatch(web3Loaded(web3))

// Load Account
dispatch(web3AccountLoaded(account))

// Load Orders
dispatch(allOrdersLoaded(orders))
```

## Selectors
```javascript
// Get account
const account = useSelector(accountSelector)

// Get orders
const orders = useSelector(filledOrdersSelector)
```
STATEEOF

cat > src/pages/state-management/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

# Create API Reference page
cat > src/pages/api-reference/index.mdx << 'APIEOF'
# API Reference

Complete function reference for Dapp-Forge.

## Helper Functions

### ether(n)
Convert to Wei.
```javascript
ether(1) // "1000000000000000000"
```

### tokens(n)
Convert to token units.
```javascript
tokens(100) // "100000000000000000000"
```

### formatBalance(balance)
Format Wei to readable string.
```javascript
formatBalance("1500000000000000000") // "1.5000"
```

## Interactions

### loadWeb3(dispatch)
Initialize Web3 connection.

### loadAccount(web3, dispatch)
Load user's account.

### loadToken(web3, networkId, dispatch)
Load token contract.

### loadExchange(web3, networkId, dispatch)
Load exchange contract.

### makeBuyOrder(exchange, token, web3, order, account, dispatch)
Create a buy order.

### fillOrder(exchange, order, account, dispatch)
Fill an existing order.

## Selectors

### accountSelector(state)
Get connected account.

### filledOrdersSelector(state)
Get filled orders with decorations.

### orderBookSelector(state)
Get buy and sell orders.

### priceChartSelector(state)
Get chart data.
APIEOF

cat > src/pages/api-reference/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

# Create Guides page
cat > src/pages/guides/index.mdx << 'GUIDESEOF'
# Guides & Tutorials

Practical guides for working with Dapp-Forge.

## Available Guides

### Getting Started
- Setting Up MetaMask
- Connecting to Blockchain
- Getting Test Tokens

### Trading
- Placing Your First Order
- Filling Orders
- Managing Orders

### Development
- Adding New Features
- Custom Components
- Testing Strategies

## Coming Soon

More guides will be added covering:
- Advanced trading strategies
- Integration with other DApps
- Security best practices
GUIDESEOF

cat > src/pages/guides/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

# Create Deployment page
cat > src/pages/deployment/index.mdx << 'DEPLOYEOF'
# Deployment Guide

Deploy Dapp-Forge to production.

## Smart Contract Deployment
```bash
# Deploy to testnet
truffle migrate --network sepolia

# Deploy to mainnet
truffle migrate --network mainnet
```

## Frontend Deployment

### Vercel
```bash
npm i -g vercel
cd src
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### IPFS
```bash
ipfs add -r build/
```

## Configuration

Create `.env.production`:
```bash
REACT_APP_NETWORK_ID=1
REACT_APP_INFURA_KEY=your_key
```

## Security Checklist

- [ ] Contracts audited
- [ ] Private keys secured
- [ ] HTTPS enabled
- [ ] Error handling tested
DEPLOYEOF

cat > src/pages/deployment/_meta.json << 'METAEOF'
{
  "index": "Overview"
}
METAEOF

echo "✅ Created all documentation pages"
echo ""
echo "🎉 Documentation complete!"
echo ""
echo "To start the docs:"
echo "  cd src"
echo "  npm run docs:dev"
echo ""
echo "Visit: http://localhost:3000"
echo ""
