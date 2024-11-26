import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/'],
  format: ['cjs', 'esm'],
  platform: 'node', 
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: true,
  external: ['crypto']

});
