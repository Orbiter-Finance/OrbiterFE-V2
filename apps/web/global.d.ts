declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module 'ethereum-blockies' {
  interface BlockiesOptions {
    seed: string
    color?: string
    bgcolor?: string
    size?: number
    scale?: number
    spotcolor?: string
    default?: number
  }

  interface Blockies {
    create(options: BlockiesOptions): HTMLCanvasElement
  }

  const blockies: Blockies

  export default blockies
}