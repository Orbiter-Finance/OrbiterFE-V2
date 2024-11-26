import { defineConfig } from 'tsup'
import inlineImage from 'esbuild-plugin-inline-image'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [
    inlineImage({
      limit: -1,
      extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg']
    })
  ]
})