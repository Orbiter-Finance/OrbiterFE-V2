export default {
  provide() {
    return {
      handlerClickJump: this.handlerClickJump,
    }
  },
  methods: {
    handlerClickJump(e) {
      const eventJumpEnum = {
        'Deep Dive into zkSync':
          'https://orbiter-finance.medium.com/oclub-ama-recap-orbiter-x-zksync-16-02-2023-63f007a96fbd',
        'Immersion into StarkWare':
          'https://orbiter-finance.medium.com/oclub-ama-recap-orbiter-x-starkware-01-03-2023-f31a180acbea',
        'A Closer Look at Polygon':
          'https://orbiter-finance.medium.com/oclub-ama-recap-orbiter-x-polygon-06-03-2023-191702976927',
      }
      const jumpUrlEnum = {
        'Start the seamless cross-rollup transaction ➝':
          'https://www.orbiter.finance/',
        'Go to Yellowpaper to learn more ➝':
          'https://github.com/Orbiter-Finance/papers/blob/main/yellowpaper/yellowpaper.pdf',
        'Learn more about the SDK of zkProver ➝':
          'https://github.com/Orbiter-Finance/zkprover-dapp',
        'View More ➝': 'https://orbiter-finance.medium.com/',
        'Orbiter Data': 'https://www.orbiter.finance/data',
        'Orbiter bridge': 'https://www.orbiter.finance/',
        'AAzkprover SDK': 'https://github.com/Orbiter-Finance/zkprover-dapp',
        Twitter: 'https://twitter.com/Orbiter_Finance',
        Discord: 'https://discord.gg/orbiter-finance',
        Medium: 'https://orbiter-finance.medium.com/',
        'User Docs': 'https://docs.orbiter.finance/',
        Yellowpaper:
          'https://github.com/Orbiter-Finance/papers/blob/main/yellowpaper/yellowpaper.pdf',
        ...eventJumpEnum,
      }
      const jumpKey = e.target.innerText || ''
      const jumpUrl = jumpUrlEnum[jumpKey] || ''
      if (!jumpUrl) return
      window.open(jumpUrl)
    },
  },
}
