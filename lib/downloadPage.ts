import JSZip from 'jszip'
import { Page } from '@/types/pageBuilder'
import {
  generatePageComponent,
  generatePackageJson,
  generateTailwindConfig,
  generatePostcssConfig,
  generateGlobalsCss,
  generateLayout,
  generateReadme,
} from './pageExporter'

export async function downloadPageAsZip(page: Page) {
  const zip = new JSZip()

  // Create app directory structure
  const appFolder = zip.folder('app')
  
  // Generate page.tsx in app/[slug] or app/page
  const pageCode = generatePageComponent(page)
  if (page.slug && page.slug !== 'page') {
    const pageFolder = appFolder?.folder(page.slug)
    pageFolder?.file('page.tsx', pageCode)
  } else {
    appFolder?.file('page.tsx', pageCode)
  }

  // Generate layout.tsx
  const layoutCode = generateLayout()
  appFolder?.file('layout.tsx', layoutCode)

  // Generate globals.css
  const globalsCss = generateGlobalsCss()
  appFolder?.file('globals.css', globalsCss)

  // Root files
  zip.file('package.json', generatePackageJson())
  zip.file('tailwind.config.js', generateTailwindConfig())
  zip.file('postcss.config.js', generatePostcssConfig())
  zip.file('tsconfig.json', generateTsConfig())
  zip.file('next.config.js', generateNextConfig())
  zip.file('README.md', generateReadme(page))
  zip.file('.gitignore', generateGitignore())

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${page.slug || 'page'}-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2)
}

function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`
}

function generateGitignore(): string {
  return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`
}

