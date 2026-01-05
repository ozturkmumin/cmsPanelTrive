import { Page, Block } from '@/types/pageBuilder'

export function downloadPageAsHtml(page: Page) {
  const html = generateHtmlPage(page)
  
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${page.slug || 'page'}-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateHtmlPage(page: Page): string {
  const blocksHtml = page.blocks
    .sort((a, b) => a.order - b.order)
    .map(block => generateBlockHtml(block))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.meta?.title || page.name || 'Page'}</title>
  ${page.meta?.description ? `<meta name="description" content="${escapeHtml(page.meta.description)}">` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
  </style>
</head>
<body class="min-h-screen bg-white">
  <main class="min-h-screen">
${blocksHtml.split('\n').map(line => '    ' + line).join('\n')}
  </main>
</body>
</html>`
}

function generateBlockHtml(block: Block): string {
  const styles = block.styles || {}
  const styleString = Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')

  const styleAttr = styleString ? ` style="${escapeHtml(styleString)}"` : ''

  switch (block.type) {
    case 'hero':
      return generateHeroHtml(block.data, styleAttr)
    case 'features':
      return generateFeaturesHtml(block.data, styleAttr)
    case 'testimonials':
      return generateTestimonialsHtml(block.data, styleAttr)
    case 'cta':
      return generateCTAHtml(block.data, styleAttr)
    case 'pricing':
      return generatePricingHtml(block.data, styleAttr)
    case 'about':
      return generateAboutHtml(block.data, styleAttr)
    case 'contact':
      return generateContactHtml(block.data, styleAttr)
    case 'gallery':
      return generateGalleryHtml(block.data, styleAttr)
    case 'text':
      return generateTextHtml(block.data, styleAttr)
    case 'image':
      return generateImageHtml(block.data, styleAttr)
    case 'video':
      return generateVideoHtml(block.data, styleAttr)
    case 'spacer':
      return generateSpacerHtml(block.data, styleAttr)
    default:
      return `    <div class="p-4">Unknown block type: ${block.type}</div>`
  }
}

function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Hero Block
function generateHeroHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || 'Welcome')
  const subtitle = escapeHtml(data.subtitle || 'Subtitle')
  const buttonText = escapeHtml(data.buttonText || '')
  const buttonLink = escapeHtml(data.buttonLink || '#')

  return `    <div class="text-center py-20 px-6"${styleAttr}>
      <h1 class="text-5xl font-bold mb-4">${title}</h1>
      <p class="text-xl text-gray-600 mb-8">${subtitle}</p>
      ${buttonText ? `<a href="${buttonLink}" class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">${buttonText}</a>` : ''}
    </div>`
}

// Features Block
function generateFeaturesHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || 'Our Features')
  const subtitle = escapeHtml(data.subtitle || '')
  const features = data.features || []

  const featuresHtml = features.length > 0
    ? features.map((feature: any, idx: number) => {
        const icon = escapeHtml(feature.icon || '✨')
        const featureTitle = escapeHtml(feature.title || 'Feature')
        const description = escapeHtml(feature.description || 'Description')
        return `          <div class="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">${icon}</div>
            <h3 class="text-xl font-semibold mb-2">${featureTitle}</h3>
            <p class="text-gray-600">${description}</p>
          </div>`
      }).join('\n')
    : `        <div class="text-center py-12">
          <span class="text-gray-400 block mb-2">✨</span>
          <span class="text-gray-400">Add features to display</span>
        </div>`

  return `    <div class="py-16 px-6"${styleAttr}>
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">${title}</h2>
        ${subtitle ? `<p class="text-gray-600">${subtitle}</p>` : ''}
      </div>
      ${features.length > 0 ? `<div class="grid md:grid-cols-3 gap-8">\n${featuresHtml}\n      </div>` : featuresHtml}
    </div>`
}

// Testimonials Block
function generateTestimonialsHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || '')
  const testimonials = data.testimonials || []

  const testimonialsHtml = testimonials.length > 0
    ? testimonials.map((testimonial: any, idx: number) => {
        const text = escapeHtml(testimonial.text || 'Testimonial text')
        const name = escapeHtml(testimonial.name || 'Name')
        const role = escapeHtml(testimonial.role || 'Role')
        const avatar = escapeHtml(testimonial.avatar || '')
        const avatarHtml = avatar
          ? `<img src="${avatar}" alt="${name}" class="w-12 h-12 rounded-full object-cover" />`
          : `<div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-500 text-xs">${name.charAt(0).toUpperCase()}</span>
            </div>`
        return `          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p class="text-gray-700 mb-4">"${text}"</p>
            <div class="flex items-center gap-3">
              ${avatarHtml}
              <div>
                <p class="font-semibold">${name}</p>
                <p class="text-sm text-gray-600">${role}</p>
              </div>
            </div>
          </div>`
      }).join('\n')
    : `        <div class="text-center py-12">
          <span class="text-gray-400 block mb-2">💬</span>
          <span class="text-gray-400">Add testimonials to display</span>
        </div>`

  return `    <div class="py-16 px-6"${styleAttr}>
      ${title ? `<h2 class="text-4xl font-bold text-center mb-12">${title}</h2>` : ''}
      ${testimonials.length > 0 ? `<div class="grid md:grid-cols-2 gap-8">\n${testimonialsHtml}\n      </div>` : testimonialsHtml}
    </div>`
}

// CTA Block
function generateCTAHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || 'Ready to Get Started?')
  const subtitle = escapeHtml(data.subtitle || 'Join us today')
  const buttonText = escapeHtml(data.buttonText || '')
  const buttonLink = escapeHtml(data.buttonLink || '#')

  return `    <div class="text-center py-20 px-6"${styleAttr}>
      <h2 class="text-4xl font-bold mb-4">${title}</h2>
      <p class="text-xl text-gray-600 mb-8">${subtitle}</p>
      ${buttonText ? `<a href="${buttonLink}" class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">${buttonText}</a>` : ''}
    </div>`
}

// Pricing Block
function generatePricingHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || '')
  const plans = data.plans || []

  const plansHtml = plans.length > 0
    ? plans.map((plan: any, idx: number) => {
        const name = escapeHtml(plan.name || 'Plan')
        const price = escapeHtml(plan.price || '$0')
        const buttonText = escapeHtml(plan.buttonText || 'Get Started')
        const featured = plan.featured ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
        const featuresHtml = (plan.features || []).map((feature: string) => 
          `<li class="flex items-center gap-2">
            <span class="text-green-600">✓</span>
            <span class="text-gray-700">${escapeHtml(feature || 'Feature')}</span>
          </li>`
        ).join('\n              ')
        
        return `          <div class="p-8 rounded-lg border-2 transition-all ${featured}">
            ${plan.featured ? `<div class="text-center mb-2">
              <span class="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">POPULAR</span>
            </div>` : ''}
            <h3 class="text-2xl font-bold mb-2">${name}</h3>
            <div class="text-4xl font-bold mb-4">${price}</div>
            <ul class="space-y-2 mb-6 min-h-[120px]">
              ${featuresHtml}
            </ul>
            <button class="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">${buttonText}</button>
          </div>`
      }).join('\n')
    : `        <div class="text-center py-12">
          <span class="text-gray-400 block mb-2">💰</span>
          <span class="text-gray-400">Add pricing plans to display</span>
        </div>`

  return `    <div class="py-16 px-6"${styleAttr}>
      ${title ? `<h2 class="text-4xl font-bold text-center mb-12">${title}</h2>` : ''}
      ${plans.length > 0 ? `<div class="grid md:grid-cols-3 gap-8">\n${plansHtml}\n      </div>` : plansHtml}
    </div>`
}

// About Block
function generateAboutHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || 'About Us')
  const content = escapeHtml(data.content || 'About content...').replace(/\n/g, '<br>')

  return `    <div class="py-16 px-6"${styleAttr}>
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold mb-6">${title}</h2>
        <p class="text-gray-700 leading-relaxed">${content}</p>
      </div>
    </div>`
}

// Contact Block
function generateContactHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || 'Contact Us')
  const subtitle = escapeHtml(data.subtitle || 'Get in touch')
  const email = escapeHtml(data.email || 'contact@example.com')
  const phone = escapeHtml(data.phone || '+1 234 567 890')

  return `    <div class="py-16 px-6"${styleAttr}>
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-4">${title}</h2>
        <p class="text-gray-600 mb-8">${subtitle}</p>
        <div class="space-y-4">
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
        </div>
      </div>
    </div>`
}

// Gallery Block
function generateGalleryHtml(data: any, styleAttr: string): string {
  const title = escapeHtml(data.title || '')
  const images = data.images || []

  const imagesHtml = images.length > 0
    ? images.map((img: string, idx: number) => {
        const imageUrl = escapeHtml(img || '')
        return imageUrl
          ? `<div class="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
              <img src="${imageUrl}" alt="Gallery ${idx + 1}" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>`
          : `<div class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span class="text-gray-400 text-sm">Image ${idx + 1}</span>
            </div>`
      }).join('\n          ')
    : `        <div class="text-center py-12">
          <span class="text-gray-400 block mb-2">🖼️</span>
          <span class="text-gray-400">Add images to gallery</span>
        </div>`

  return `    <div class="py-16 px-6"${styleAttr}>
      ${title ? `<h2 class="text-4xl font-bold text-center mb-12">${title}</h2>` : ''}
      ${images.length > 0 ? `<div class="grid md:grid-cols-3 gap-4">\n          ${imagesHtml}\n      </div>` : imagesHtml}
    </div>`
}

// Text Block
function generateTextHtml(data: any, styleAttr: string): string {
  const content = escapeHtml(data.content || 'Text content...').replace(/\n/g, '<br>')

  return `    <div class="py-8 px-6"${styleAttr}>
      <div class="prose max-w-none">
        <div class="whitespace-pre-wrap">${content}</div>
      </div>
    </div>`
}

// Image Block
function generateImageHtml(data: any, styleAttr: string): string {
  const image = escapeHtml(data.image || '')
  const alt = escapeHtml(data.alt || 'Image')
  const caption = escapeHtml(data.caption || '')

  return `    <div class="py-8 px-6"${styleAttr}>
      <div class="max-w-4xl mx-auto">
        ${image
          ? `<img src="${image}" alt="${alt}" class="w-full rounded-lg" />`
          : `<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span class="text-gray-400">Image</span>
            </div>`
        }
        ${caption ? `<p class="text-center text-gray-600 mt-2">${caption}</p>` : ''}
      </div>
    </div>`
}

// Video Block
function generateVideoHtml(data: any, styleAttr: string): string {
  const videoUrl = escapeHtml(data.videoUrl || '')
  const title = escapeHtml(data.title || '')
  
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

  return `    <div class="py-8 px-6"${styleAttr}>
      <div class="max-w-4xl mx-auto">
        ${videoUrl
          ? `<div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe src="${getEmbedUrl(videoUrl)}" class="w-full h-full" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>`
          : `<div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div class="text-center">
                <span class="text-gray-400 block mb-2">📹</span>
                <span class="text-gray-400 text-sm">Add video URL</span>
              </div>
            </div>`
        }
        ${title ? `<h3 class="text-xl font-semibold mt-4">${title}</h3>` : ''}
      </div>
    </div>`
}

// Spacer Block
function generateSpacerHtml(data: any, styleAttr: string): string {
  const height = data.height || '40px'
  return `    <div style="height: ${height};"${styleAttr}></div>`
}

