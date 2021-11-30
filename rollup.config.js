import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

import { main, module as _module, types } from './package.json'

const bundle = config => ({
  input: 'src/index.ts',
  ...config,
  external: ['oauth']
})

const options = [
  bundle({
    plugins: [
      terser({ output: { comments: false } }),
      typescript()
    ],
    output: [
      { file: main, format: 'cjs' },
      { file: _module, format: 'es' }
    ]
  }),
  bundle({
    plugins: [dts()],
    output: { file: types, format: 'es' }
  })
]

export default options
