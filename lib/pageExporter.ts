import { Page, Block } from '@/types/pageBuilder'

// Generate Next.js page component code
export function generatePageComponent(page: Page): string {
  const blocksCode = page.blocks
    .sort((a, b) => a.order - b.order)
    .map(block => generateBlockComponent(block))
    .join('\n\n')

  return `'use client'

import React from 'react'

export default function Page() {
  return (
    <main className="min-h-screen">
${blocksCode.split('\n').map(line => '      ' + line).join('\n')}
    </main>
  )
}
`
}

// Generate block component code
function generateBlockComponent(block: Block): string {
  const styles = block.styles || {}
  const styleString = Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: '${value}'`
    })
    .join(', ')

  const styleAttr = styleString ? ` style={{ ${styleString} }}` : ''

  switch (block.type) {
    case 'hero':
      return generateHeroBlock(block.data, styleAttr)
    case 'features':
      return generateFeaturesBlock(block.data, styleAttr)
    case 'testimonials':
      return generateTestimonialsBlock(block.data, styleAttr)
    case 'cta':
      return generateCTABlock(block.data, styleAttr)
    case 'pricing':
      return generatePricingBlock(block.data, styleAttr)
    case 'about':
      return generateAboutBlock(block.data, styleAttr)
    case 'contact':
      return generateContactBlock(block.data, styleAttr)
    case 'gallery':
      return generateGalleryBlock(block.data, styleAttr)
    case 'text':
      return generateTextBlock(block.data, styleAttr)
    case 'image':
      return generateImageBlock(block.data, styleAttr)
    case 'video':
      return generateVideoBlock(block.data, styleAttr)
    case 'spacer':
      return generateSpacerBlock(block.data, styleAttr)
    default:
      return `      <div${styleAttr}></div>`
  }
}

function generateHeroBlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">${escapeString(data.title || 'Welcome')}</h1>
        <p className="text-xl mb-8">${escapeString(data.subtitle || '')}</p>
        ${data.buttonText ? `<a href="${escapeString(data.buttonLink || '#')}" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">${escapeString(data.buttonText)}</a>` : ''}
      </section>`
}

function generateFeaturesBlock(data: any, styleAttr: string): string {
  const features = (data.features || []).map((f: any, idx: number) => `
        <div key={${idx}} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">${escapeString(f.icon || '✨')}</div>
          <h3 className="text-xl font-semibold mb-2">${escapeString(f.title || 'Feature')}</h3>
          <p className="text-gray-600">${escapeString(f.description || '')}</p>
        </div>`).join('')

  return `      <section${styleAttr} className="py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">${escapeString(data.title || 'Our Features')}</h2>
          ${data.subtitle ? `<p className="text-gray-600">${escapeString(data.subtitle)}</p>` : ''}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          ${features}
        </div>
      </section>`
}

function generateTestimonialsBlock(data: any, styleAttr: string): string {
  const testimonials = (data.testimonials || []).map((t: any, idx: number) => `
        <div key={${idx}} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-4">"${escapeString(t.text || '')}"</p>
          <div className="flex items-center gap-3">
            ${t.avatar ? `<img src="${escapeString(t.avatar)}" alt="${escapeString(t.name || '')}" className="w-12 h-12 rounded-full object-cover" />` : '<div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"><span className="text-gray-500 text-xs">' + (t.name?.[0]?.toUpperCase() || 'U') + '</span></div>'}
            <div>
              <p className="font-semibold">${escapeString(t.name || 'Name')}</p>
              <p className="text-sm text-gray-600">${escapeString(t.role || '')}</p>
            </div>
          </div>
        </div>`).join('')

  return `      <section${styleAttr} className="py-16 px-6">
        ${data.title ? `<h2 className="text-4xl font-bold text-center mb-12">${escapeString(data.title)}</h2>` : ''}
        <div className="grid md:grid-cols-2 gap-8">
          ${testimonials}
        </div>
      </section>`
}

function generateCTABlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">${escapeString(data.title || 'Ready to Get Started?')}</h2>
        <p className="text-xl mb-8">${escapeString(data.subtitle || '')}</p>
        ${data.buttonText ? `<a href="${escapeString(data.buttonLink || '#')}" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">${escapeString(data.buttonText)}</a>` : ''}
      </section>`
}

function generatePricingBlock(data: any, styleAttr: string): string {
  const plans = (data.plans || []).map((plan: any, idx: number) => {
    const features = (plan.features || []).map((f: string, fIdx: number) => `
                <li key={${fIdx}} className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">${escapeString(f)}</span>
                </li>`).join('')

    return `
        <div key={${idx}} className={\`p-8 rounded-lg border-2 transition-all \${${plan.featured ? 'true' : 'false'} ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'}\`}>
          ${plan.featured ? '<div className="text-center mb-2"><span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">POPULAR</span></div>' : ''}
          <h3 className="text-2xl font-bold mb-2">${escapeString(plan.name || 'Plan')}</h3>
          <div className="text-4xl font-bold mb-4">${escapeString(plan.price || '$0')}</div>
          <ul className="space-y-2 mb-6 min-h-[120px]">
            ${features}
          </ul>
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            ${escapeString(plan.buttonText || 'Get Started')}
          </button>
        </div>`
  }).join('')

  return `      <section${styleAttr} className="py-16 px-6">
        ${data.title ? `<h2 className="text-4xl font-bold text-center mb-12">${escapeString(data.title)}</h2>` : ''}
        <div className="grid md:grid-cols-3 gap-8">
          ${plans}
        </div>
      </section>`
}

function generateAboutBlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">${escapeString(data.title || 'About Us')}</h2>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">${escapeString(data.content || '')}</div>
        </div>
      </section>`
}

function generateContactBlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">${escapeString(data.title || 'Contact Us')}</h2>
          ${data.subtitle ? `<p className="text-gray-600 mb-8">${escapeString(data.subtitle)}</p>` : ''}
          <div className="space-y-4">
            <p>Email: <a href="mailto:${escapeString(data.email || '')}" className="text-indigo-600 hover:underline">${escapeString(data.email || 'contact@example.com')}</a></p>
            <p>Phone: <a href="tel:${escapeString(data.phone || '')}" className="text-indigo-600 hover:underline">${escapeString(data.phone || '+1 234 567 890')}</a></p>
          </div>
        </div>
      </section>`
}

function generateGalleryBlock(data: any, styleAttr: string): string {
  const images = (data.images || []).map((img: string, idx: number) => `
        <div key={${idx}} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
          ${img ? `<img src="${escapeString(img)}" alt="Gallery ${idx + 1}" className="w-full h-full object-cover transition-transform group-hover:scale-105" />` : '<div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300"><span className="text-gray-400 text-sm">Image ' + (idx + 1) + '</span></div>'}
        </div>`).join('')

  return `      <section${styleAttr} className="py-16 px-6">
        ${data.title ? `<h2 className="text-4xl font-bold text-center mb-12">${escapeString(data.title)}</h2>` : ''}
        <div className="grid md:grid-cols-3 gap-4">
          ${images}
        </div>
      </section>`
}

function generateTextBlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="py-8 px-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">${escapeString(data.content || '')}</div>
        </div>
      </section>`
}

function generateImageBlock(data: any, styleAttr: string): string {
  return `      <section${styleAttr} className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          ${data.image ? `<img src="${escapeString(data.image)}" alt="${escapeString(data.alt || 'Image')}" className="w-full rounded-lg" />` : '<div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-400">Image</span></div>'}
          ${data.caption ? `<p className="text-center text-gray-600 mt-2">${escapeString(data.caption)}</p>` : ''}
        </div>
      </section>`
}

function generateVideoBlock(data: any, styleAttr: string): string {
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('embed')) return url
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    return url
  }

  return `      <section${styleAttr} className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          ${data.videoUrl ? `<div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe src="${getEmbedUrl(data.videoUrl)}" className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </div>` : '<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"><span className="text-gray-400">Add video URL</span></div>'}
          ${data.title ? `<h3 className="text-xl font-semibold mt-4">${escapeString(data.title)}</h3>` : ''}
        </div>
      </section>`
}

function generateSpacerBlock(data: any, styleAttr: string): string {
  return `      <div style={{ height: '${data.height || '40px'}' }} />`
}

function escapeString(str: string): string {
  if (!str) return ''
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
    .replace(/\n/g, '\\n')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
}

// Generate package.json for the exported page
export function generatePackageJson(): string {
  return JSON.stringify({
    name: 'exported-page',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      tailwindcss: '^3.3.0',
      autoprefixer: '^10.4.0',
      postcss: '^8.4.0',
    },
  }, null, 2)
}

// Generate tailwind.config.js
export function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
}

// Generate postcss.config.js
export function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
}

// Generate globals.css
export function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;
`
}

// Generate layout.tsx
export function generateLayout(): string {
  return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Exported Page',
  description: 'Page exported from Page Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`
}

// Generate README.md
export function generateReadme(page: Page): string {
  return `# ${page.name}

This page was exported from the Page Builder.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the page.

## Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Page Info

- **Name:** ${page.name}
- **Slug:** ${page.slug}
- **Blocks:** ${page.blocks.length}
- **Exported:** ${new Date().toISOString()}
`
}

