#!/bin/bash

# Dapp-Forge Documentation Setup Script
# Run this script from the client directory

set -e  # Exit on error

echo "🚀 Setting up Dapp-Forge Documentation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: 'package.json' not found${NC}"
    echo "Please run this script from your client directory"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking dependencies...${NC}"
# Check if nextra is already in package.json
if grep -q "nextra" package.json; then
    echo -e "${GREEN}✓ Nextra already in package.json${NC}"
else
    echo -e "${YELLOW}Installing Nextra dependencies...${NC}"
    npm install nextra@latest nextra-theme-docs@latest
fi

# Check if scripts are in package.json
if grep -q "docs:dev" package.json; then
    echo -e "${GREEN}✓ Documentation scripts already configured${NC}"
else
    echo -e "${YELLOW}Adding documentation scripts to package.json...${NC}"
    # Backup package.json
    cp package.json package.json.backup
    
    # Use node to add scripts (cross-platform compatible)
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = {
      ...pkg.scripts,
      'docs:dev': 'next dev',
      'docs:build': 'next build',
      'docs:start': 'next start',
      'docs:export': 'next build && next export'
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    echo -e "${GREEN}✓ Scripts added${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Creating directory structure...${NC}"
mkdir -p src/pages/getting-started
mkdir -p src/pages/architecture
mkdir -p src/pages/smart-contracts
mkdir -p src/pages/frontend
mkdir -p src/pages/state-management
mkdir -p src/pages/api-reference
mkdir -p src/pages/guides
mkdir -p src/pages/deployment
mkdir -p src/public

echo ""
echo -e "${BLUE}Step 3: Creating configuration files...${NC}"

# Create next.config.mjs
cat > src/next.config.mjs << 'EOF'
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true,
  latex: true,
  search: {
    codeblocks: true
  }
})

export default withNextra({
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  pageExtensions: ['mdx', 'md'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      }
    }
    return config
  }
})
EOF

# Create theme.config.jsx
cat > src/theme.config.jsx << 'EOF'
import { useRouter } from 'next/router'

const config = {
  logo: <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>⚡ Dapp-Forge</span>,
  project: {
    link: 'https://github.com/Hrsh111/Dapp-Forge'
  },
  chat: {
    link: 'https://discord.gg/dapp-forge'
  },
  docsRepositoryBase: 'https://github.com/Hrsh111/Dapp-Forge/tree/main/src',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/Hrsh111/Dapp-Forge" target="_blank" rel="noopener noreferrer">
          Dapp-Forge
        </a>
        .
      </span>
    )
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Dapp-Forge Documentation" />
      <meta property="og:description" content="Decentralized Exchange Platform - Complete Documentation" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Dapp-Forge'
      }
    }
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark'
  }
}

export default config
EOF

echo ""
echo -e "${BLUE}Step 4: Creating navigation files...${NC}"

# Root _meta.json
cat > src/pages/_meta.json << 'EOF'
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
EOF

# Create _meta.json for each subdirectory
for dir in getting-started architecture smart-contracts frontend state-management api-reference guides deployment; do
    cat > "src/pages/$dir/_meta.json" << 'EOF'
{
  "index": "Overview"
}
EOF
done

echo ""
echo -e "${BLUE}Step 5: Creating homepage...${NC}"

cat > src/pages/index.mdx << 'EOF'
# Dapp-Forge Documentation

Welcome to **Dapp-Forge** - A decentralized exchange (DEX) platform built on Ethereum blockchain technology.

## What is Dapp-Forge?

Dapp-Forge is a fully decentralized application that enables peer-to-peer token trading without intermediaries.

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

- 🔒 **Security** - Smart contract-based trading
- 🌐 **Transparency** - All transactions on blockchain
- 💰 **Control** - Full custody of assets
- ⚡ **Efficiency** - Direct peer-to-peer trading
- 📊 **Real-time** - Live order books and charts

## Get Started

- [Getting Started](/getting-started) - Installation and setup
- [Architecture](/architecture) - System design
- [Smart Contracts](/smart-contracts) - Contract documentation
- [API Reference](/api-reference) - Complete API docs

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Bootstrap 5
- **Blockchain**: Ethereum, Web3.js, Solidity
- **Charts**: ApexCharts
- **State**: Redux with Reselect
EOF

echo ""
echo -e "${BLUE}Step 6: Creating placeholder content pages...${NC}"

# Getting Started
cat > src/pages/getting-started/index.mdx << 'EOF'
# Getting Started

Learn how to set up and use Dapp-Forge.

## Prerequisites

- Node.js v16+
- npm v7+
- MetaMask browser extension

## Installation

```bash
git clone https://github.com/Hrsh111/Dapp-Forge.git
cd Dapp-Forge/client
npm install
npm start
```

## Next Steps

- [Architecture](/architecture) - Understand the system
- [Smart Contracts](/smart-contracts) - Learn about contracts
EOF

# Architecture
cat > src/pages/architecture/index.mdx << 'EOF'
# Architecture Overview

Dapp-Forge follows a modern DApp architecture.

## System Components

- Frontend (React)
- Smart Contracts (Ethereum)
- State Management (Redux)
- Web3 Integration

## Data Flow

User → Component → Redux → Web3 → Smart Contract
EOF

# Smart Contracts
cat > src/pages/smart-contracts/index.mdx << 'EOF'
# Smart Contracts

Documentation for Exchange and Token contracts.

## Exchange Contract

Manages all trading operations.

## Token Contract

ERC-20 token implementation.
EOF

# Frontend
cat > src/pages/frontend/index.mdx << 'EOF'
# Frontend Components

React components for the DEX interface.

## Components

- Navbar
- Balance
- OrderBook
- PriceChart
- Trades
EOF

# State Management
cat > src/pages/state-management/index.mdx << 'EOF'
# State Management

Redux store configuration and patterns.

## Store Structure

```javascript
{
  web3: { connection, account },
  token: { loaded, contract },
  exchange: { loaded, contract, orders }
}
```
EOF

# API Reference
cat > src/pages/api-reference/index.mdx << 'EOF'
# API Reference

Complete function reference.

## Helper Functions

- `ether(n)` - Convert to Wei
- `tokens(n)` - Convert to token units
- `formatBalance()` - Format balance

## Interactions

- `loadWeb3()`
- `loadAccount()`
- `loadToken()`
- `loadExchange()`
EOF

# Guides
cat > src/pages/guides/index.mdx << 'EOF'
# Guides & Tutorials

Practical guides for Dapp-Forge.

## Available Guides

- Setting up MetaMask
- Placing your first order
- Deploying contracts
EOF

# Deployment
cat > src/pages/deployment/index.mdx << 'EOF'
# Deployment Guide

Deploy Dapp-Forge to production.

## Smart Contracts

```bash
truffle migrate --network mainnet
```

## Frontend

```bash
npm run build
vercel deploy
```
EOF

echo ""
echo -e "${BLUE}Step 7: Cleaning up...${NC}"
rm -rf src/.next

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the generated files in 'src/pages'"
echo "2. Customize 'src/theme.config.jsx' with your branding"
echo "3. Add detailed content to the .mdx files"
echo "4. Run the documentation server"
echo ""
echo -e "${BLUE}To start the docs server:${NC}"
echo "  cd src"
echo "  npm run docs:dev"
echo ""
echo -e "${GREEN}Your documentation will be available at:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${GREEN}Happy documenting! 📚${NC}"