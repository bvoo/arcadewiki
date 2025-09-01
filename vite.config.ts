import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // Enable MDX with frontmatter export
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    tanstackStart({
      customViteReactPlugin: true,
      // Use the Pages preset so Nitro doesn't declare a reserved 'ASSETS' binding
      target: 'cloudflare-pages'
    }),
    viteReact(),
  ],
})

export default config
