export interface Block {
  id: string
  type: BlockType
  data: Record<string, any>
  styles?: BlockStyles
  order: number
}

export type BlockType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'gallery'
  | 'text'
  | 'image'
  | 'video'
  | 'spacer'

export interface BlockStyles {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
}

export interface Page {
  id: string
  name: string
  slug: string
  blocks: Block[]
  meta?: {
    title?: string
    description?: string
    keywords?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface BlockTemplate {
  type: BlockType
  name: string
  icon: string
  description: string
  defaultData: Record<string, any>
  defaultStyles?: BlockStyles
}

