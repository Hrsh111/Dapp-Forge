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
