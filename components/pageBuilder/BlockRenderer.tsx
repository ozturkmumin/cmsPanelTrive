'use client'

import React from 'react'
import { Block } from '@/types/pageBuilder'

interface BlockRendererProps {
  block: Block
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock data={block.data} />
    case 'features':
      return <FeaturesBlock data={block.data} />
    case 'testimonials':
      return <TestimonialsBlock data={block.data} />
    case 'cta':
      return <CTABlock data={block.data} />
    case 'pricing':
      return <PricingBlock data={block.data} />
    case 'about':
      return <AboutBlock data={block.data} />
    case 'contact':
      return <ContactBlock data={block.data} />
    case 'gallery':
      return <GalleryBlock data={block.data} />
    case 'text':
      return <TextBlock data={block.data} />
    case 'image':
      return <ImageBlock data={block.data} />
    case 'video':
      return <VideoBlock data={block.data} />
    case 'spacer':
      return <SpacerBlock data={block.data} />
    default:
      return <div>Unknown block type</div>
  }
}

// Hero Block
function HeroBlock({ data }: any) {
  return (
    <div className="text-center py-20 px-6">
      <h1 className="text-5xl font-bold mb-4">{data.title || 'Welcome'}</h1>
      <p className="text-xl text-gray-600 mb-8">{data.subtitle || 'Subtitle'}</p>
      {data.buttonText && (
        <a
          href={data.buttonLink || '#'}
          className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {data.buttonText}
        </a>
      )}
    </div>
  )
}

// Features Block
function FeaturesBlock({ data }: any) {
  const features = data.features || []
  return (
    <div className="py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{data.title || 'Our Features'}</h2>
        {data.subtitle && (
          <p className="text-gray-600">{data.subtitle}</p>
        )}
      </div>
      {features.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature: any, idx: number) => (
            <div key={idx} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon || '✨'}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title || 'Feature'}</h3>
              <p className="text-gray-600">{feature.description || 'Description'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-gray-400 block mb-2">✨</span>
          <span className="text-gray-400">Add features to display</span>
        </div>
      )}
    </div>
  )
}

// Testimonials Block
function TestimonialsBlock({ data }: any) {
  const testimonials = data.testimonials || []
  return (
    <div className="py-16 px-6">
      {data.title && (
        <h2 className="text-4xl font-bold text-center mb-12">{data.title}</h2>
      )}
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial: any, idx: number) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4">"{testimonial.text || 'Testimonial text'}"</p>
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs">{(testimonial.name || 'U')[0].toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{testimonial.name || 'Name'}</p>
                  <p className="text-sm text-gray-600">{testimonial.role || 'Role'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-gray-400 block mb-2">💬</span>
          <span className="text-gray-400">Add testimonials to display</span>
        </div>
      )}
    </div>
  )
}

// CTA Block
function CTABlock({ data }: any) {
  return (
    <div className="text-center py-20 px-6">
      <h2 className="text-4xl font-bold mb-4">{data.title || 'Ready to Get Started?'}</h2>
      <p className="text-xl text-gray-600 mb-8">{data.subtitle || 'Join us today'}</p>
      {data.buttonText && (
        <a
          href={data.buttonLink || '#'}
          className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {data.buttonText}
        </a>
      )}
    </div>
  )
}

// Pricing Block
function PricingBlock({ data }: any) {
  const plans = data.plans || []
  return (
    <div className="py-16 px-6">
      {data.title && (
        <h2 className="text-4xl font-bold text-center mb-12">{data.title}</h2>
      )}
      {plans.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, idx: number) => (
            <div
              key={idx}
              className={`p-8 rounded-lg border-2 transition-all ${
                plan.featured
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.featured && (
                <div className="text-center mb-2">
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name || 'Plan'}</h3>
              <div className="text-4xl font-bold mb-4">{plan.price || '$0'}</div>
              <ul className="space-y-2 mb-6 min-h-[120px]">
                {(plan.features || []).map((feature: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{feature || 'Feature'}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                {plan.buttonText || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-gray-400 block mb-2">💰</span>
          <span className="text-gray-400">Add pricing plans to display</span>
        </div>
      )}
    </div>
  )
}

// About Block
function AboutBlock({ data }: any) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">{data.title || 'About Us'}</h2>
        <p className="text-gray-700 leading-relaxed">{data.content || 'About content...'}</p>
      </div>
    </div>
  )
}

// Contact Block
function ContactBlock({ data }: any) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{data.title || 'Contact Us'}</h2>
        <p className="text-gray-600 mb-8">{data.subtitle || 'Get in touch'}</p>
        <div className="space-y-4">
          <p>Email: {data.email || 'contact@example.com'}</p>
          <p>Phone: {data.phone || '+1 234 567 890'}</p>
        </div>
      </div>
    </div>
  )
}

// Gallery Block
function GalleryBlock({ data }: any) {
  const images = data.images || []
  
  return (
    <div className="py-16 px-6">
      {data.title && (
        <h2 className="text-4xl font-bold text-center mb-12">{data.title}</h2>
      )}
      {images.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
              {img ? (
                <>
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">Invalid URL</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-sm">Image {idx + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-gray-400 block mb-2">🖼️</span>
          <span className="text-gray-400">Add images to gallery</span>
        </div>
      )}
    </div>
  )
}

// Text Block
function TextBlock({ data }: any) {
  return (
    <div className="py-8 px-6">
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap">{data.content || 'Text content...'}</div>
      </div>
    </div>
  )
}

// Image Block
function ImageBlock({ data }: any) {
  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {data.image ? (
          <img src={data.image} alt={data.alt || 'Image'} className="w-full rounded-lg" />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Image</span>
          </div>
        )}
        {data.caption && (
          <p className="text-center text-gray-600 mt-2">{data.caption}</p>
        )}
      </div>
    </div>
  )
}

// Video Block
function VideoBlock({ data }: any) {
  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // If already an embed URL, return as is
    if (url.includes('embed')) return url
    
    // Convert YouTube watch URL to embed
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // Convert YouTube short URL to embed
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    return url
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {data.videoUrl ? (
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(data.videoUrl)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-gray-400 block mb-2">📹</span>
              <span className="text-gray-400 text-sm">Add video URL</span>
            </div>
          </div>
        )}
        {data.title && (
          <h3 className="text-xl font-semibold mt-4">{data.title}</h3>
        )}
      </div>
    </div>
  )
}

// Spacer Block
function SpacerBlock({ data }: any) {
  return <div style={{ height: data.height || '40px' }} />
}

