import { BlockTemplate } from '@/types/pageBuilder'

export const blockTemplates: BlockTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: '🎯',
    description: 'Ana başlık ve CTA butonu ile hero bölümü',
    defaultData: {
      title: 'Welcome to Our Platform',
      subtitle: 'Build amazing things with our tools',
      buttonText: 'Get Started',
      buttonLink: '#',
      image: '',
    },
    defaultStyles: {
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      padding: '80px 20px',
    },
  },
  {
    type: 'features',
    name: 'Features',
    icon: '✨',
    description: 'Özellikler listesi',
    defaultData: {
      title: 'Our Features',
      subtitle: 'Everything you need',
      features: [
        { title: 'Feature 1', description: 'Description 1', icon: '🚀' },
        { title: 'Feature 2', description: 'Description 2', icon: '⚡' },
        { title: 'Feature 3', description: 'Description 3', icon: '🎨' },
      ],
    },
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    icon: '💬',
    description: 'Müşteri yorumları',
    defaultData: {
      title: 'What Our Customers Say',
      testimonials: [
        { name: 'John Doe', role: 'CEO', text: 'Amazing service!', avatar: '' },
        { name: 'Jane Smith', role: 'Designer', text: 'Love it!', avatar: '' },
      ],
    },
  },
  {
    type: 'cta',
    name: 'Call to Action',
    icon: '📢',
    description: 'Harekete geçirici bölüm',
    defaultData: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of happy customers',
      buttonText: 'Start Now',
      buttonLink: '#',
    },
    defaultStyles: {
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      padding: '60px 20px',
    },
  },
  {
    type: 'pricing',
    name: 'Pricing',
    icon: '💰',
    description: 'Fiyatlandırma tablosu',
    defaultData: {
      title: 'Choose Your Plan',
      plans: [
        { name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'], buttonText: 'Get Started' },
        { name: 'Pro', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3'], buttonText: 'Get Started', featured: true },
        { name: 'Enterprise', price: '$99', features: ['All Features'], buttonText: 'Contact Us' },
      ],
    },
  },
  {
    type: 'about',
    name: 'About',
    icon: '📖',
    description: 'Hakkımızda bölümü',
    defaultData: {
      title: 'About Us',
      content: 'We are a team of passionate developers...',
      image: '',
    },
  },
  {
    type: 'contact',
    name: 'Contact',
    icon: '📧',
    description: 'İletişim formu',
    defaultData: {
      title: 'Get in Touch',
      subtitle: 'We would love to hear from you',
      email: 'contact@example.com',
      phone: '+1 234 567 890',
    },
  },
  {
    type: 'gallery',
    name: 'Gallery',
    icon: '🖼️',
    description: 'Görsel galerisi',
    defaultData: {
      title: 'Our Gallery',
      images: ['', '', ''],
    },
  },
  {
    type: 'text',
    name: 'Text Block',
    icon: '📝',
    description: 'Metin bloğu',
    defaultData: {
      content: 'Your text content here...',
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: '🖼️',
    description: 'Tek görsel',
    defaultData: {
      image: '',
      alt: 'Image',
      caption: '',
    },
  },
  {
    type: 'video',
    name: 'Video',
    icon: '🎥',
    description: 'Video embed',
    defaultData: {
      videoUrl: '',
      title: 'Video Title',
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    icon: '↕️',
    description: 'Boşluk ekleyici',
    defaultData: {
      height: '40px',
    },
  },
]

