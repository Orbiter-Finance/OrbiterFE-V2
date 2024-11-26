import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: true,
  plugins: [
    polyfillNode({
      globals: {
        buffer: true,
      },
    }),
  ],
});
