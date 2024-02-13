// Docs about config options: https://rollupjs.org/command-line-interface/
// Full list of options: https://rollupjs.org/configuration-options/
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import extension from './extensions.js';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  input: 'src/index.ts',
  external: Object.keys(pkg.peerDependencies),
  output: {
    file: 'out/bundle.js',
    format: 'iife',
    name: "globalBundleOutput",
    globals: {
      ['@bhoos/game-kit-engine']: 'gameKitEngine',
      ['@bhoos/game-kit-ui']: 'gameKitUI',
      ['@bhoos/react-kit-modal']: 'reactKitModal',
      ['react']: 'React',
      ['react-native']: 'rn',
      ['@shopify/react-native-skia']: 'Skia'
    }
  },
 plugins: [
   extension({
     extensions: ['.js', '.jsx', '.ts', '.tsx']
   }),
   nodeResolve({
     mainFields: ['react-native', 'browser', 'module', 'main']
   }),
   json(),
   babel({
     babelHelpers: 'runtime',
     extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
   }),
   commonjs({
     extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs'],
     transformMixedEsModules: true,
   }),

 ]
})
