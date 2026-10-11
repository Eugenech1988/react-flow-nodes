import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import type { Plugin } from 'vite'

const appSrc = path.resolve(import.meta.dirname, './src')
const uiSrc = path.resolve(import.meta.dirname, '../../packages/ui/src')

const workspaceAliases: Plugin = {
  name: 'workspace-source-aliases',
  enforce: 'pre' as const,
  resolveId(source, importer) {
    if (!source.startsWith('@/')) return null

    const isUiSource = importer?.includes(
      `${path.sep}packages${path.sep}ui${path.sep}src${path.sep}`,
    )
    const sourceRoot = isUiSource ? uiSrc : appSrc

    return this.resolve(path.resolve(sourceRoot, source.slice(2)), importer, {
      skipSelf: true,
    })
  },
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    workspaceAliases,
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
