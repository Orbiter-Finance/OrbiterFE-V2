export const chain2idMap = {
  Mainnet: 1,
  Arbitrum: 2,
  ZkSync: 3,
  StarkNet: 4,
  Polygon: 6,
  Optimism: 7,
  ImmutableX: 8,
  Metis: 10,
  dYdX: 11,
  'Polygon ZKEVM': 17,
  Rinkeby: 5,
  'Arbitrum(R)': 22,
  'ZkSync(R)': 33,
  'StarkNet(R)': 44,
  'Polygon(R)': 66,
  'Optimism(G)': 77,
  Loopring: 9,
  'Loopring(G)': 99,
  'ImmutableX(R)': 88,
  'Metis(R)': 510,
  'dYdX(R)': 511,
  zkspace: 12,
  'zkspace(R)': 512,
  'Boba(R)': 513,
  Boba: 13,
  zkSync2: 14,
  'zkSync2(G)': 514,
  'BNBChain(R)': 515,
  BNBChain: 15,
  'Arbitrum Nova': 16,
  'Arbitrum Nova(Goerli)': 516,
  'Polygon ZKEVM(Goerli)': 517,
  ScrollL1: 518,
  ScrollL2: 519,
  Taiko: 520,
}

export const chain2icon = (item) => {
  let iconName = 'tokenLogo'
  if (item === 2 || item === 22) {
    iconName = 'arblogo'
  }
  if (item === 3 || item === 33) {
    iconName = 'zklogo'
  }
  if (item === 4 || item === 44) {
    iconName = 'sknlogo'
  }
  if (item === 6 || item === 66) {
    iconName = 'pglogo'
  }
  if (item === 7 || item === 77) {
    iconName = 'oplogo'
  }
  if (item === 8 || item === 88) {
    iconName = 'imxlogo'
  }
  if (item === 9 || item === 99) {
    iconName = 'loopringlogo'
  }
  if (item === 10 || item === 510) {
    iconName = 'metislogo'
  }
  if (item === 11 || item === 511) {
    iconName = 'dydxlogo'
  }
  if (item === 12 || item === 512) {
    iconName = 'zkspacelogo'
  }
  if (item === 13 || item === 513) {
    iconName = 'bobalogo'
  }
  if (item === 14 || item === 514) {
    iconName = 'zk2logo'
  }
  if (item === 15 || item === 515) {
    iconName = 'bsclogo'
  }
  if (item === 16 || item === 516) {
    iconName = 'arnavologo'
  }
  if (item === 17 || item === 517) {
    iconName = 'polygon_zkevm_logo'
  }
  if (item === 18 || item === 518 || item === 19 || item === 519) {
    iconName = 'scrolllogo'
  }
  if (item === 20 || item === 520) {
    iconName = 'taiko'
  }
  return iconName
}
