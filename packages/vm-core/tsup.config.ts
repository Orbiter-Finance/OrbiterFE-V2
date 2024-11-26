import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target:'esnext',
  minify: true,
  plugins: [
    polyfillNode({
      globals: {
        buffer: true,
      },
    }),
  ]
});
