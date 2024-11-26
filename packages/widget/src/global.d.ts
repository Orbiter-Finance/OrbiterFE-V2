
declare module 'ethereum-blockies' {
  interface BlockiesOptions {
    seed: string
    color?: string
    bgcolor?: string
    size?: number
    scale?: number
    spotcolor?: string
  }

  interface Blockies {
    create(options: BlockiesOptions): HTMLCanvasElement
  }

  const blockies: Blockies

  export default blockies
}

declare module "*.png" {
  const value: string
  export default value
}

declare module "*.svg" {
  const value: string
  export default value
}