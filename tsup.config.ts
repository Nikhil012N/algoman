import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: 'terser',
  terserOptions: {
    compress: {
      passes: 3,
      drop_console: true,
      pure_funcs: ['console.log', 'console.info'],
    },
    mangle: {
      toplevel: true,
    },
    format: {
      comments: false,
    },
  },
  treeshake: true,
  splitting: false,
});

