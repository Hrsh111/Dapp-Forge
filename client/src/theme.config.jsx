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
