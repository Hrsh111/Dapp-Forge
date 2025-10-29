export default {
  logo: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>⚡ Dapp-Forge</span>,
  project: {
    link: 'https://github.com/Hrsh111/Dapp-Forge',
  },
  docsRepositoryBase: 'https://github.com/Hrsh111/Dapp-Forge/tree/main/docs',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Dapp-Forge'
    }
  },
  navigation: true,
  darkMode: true,
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} © Dapp-Forge
      </span>
    )
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true
  }
}
