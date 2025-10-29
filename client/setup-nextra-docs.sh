#!/bin/bash

# Nextra Documentation Setup Script for Dapp-Forge
# This script creates the complete documentation structure

echo "🚀 Setting up Nextra Documentation for Dapp-Forge..."

# Create main docs directory structure
mkdir -p src/pages
mkdir -p src/pages/getting-started
mkdir -p src/pages/architecture
mkdir -p src/pages/smart-contracts
mkdir -p src/pages/frontend
mkdir -p src/pages/state-management
mkdir -p src/pages/api-reference
mkdir -p src/pages/deployment
mkdir -p src/pages/guides
mkdir -p src/public

echo "✅ Created directory structure"

# Create theme.config.jsx
cat > src/theme.config.jsx << 'THEMEEOF'
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
        <a href="https://github.com/Hrsh111/Dapp-Forge" target="_blank">
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
THEMEEOF

echo "✅ Created theme.config.jsx"

# Create next.config.mjs
cat > src/next.config.mjs << 'NEXTEOF'
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
NEXTEOF

echo "✅ Created next.config.mjs"

echo ""
echo "✨ Nextra setup complete!"
echo ""
echo "Next steps:"
echo "1. Run the create-documentation.sh script"
echo "2. Run: cd src && npm run docs:dev"
echo ""
