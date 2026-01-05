import { NextResponse } from 'next/server'
import { getTranslations, getLanguages } from '@/lib/firestore'

// Get all translations for all languages
export async function GET() {
  try {
    console.log('📥 API Request: GET /api/translations/all')
    const languages = await getLanguages()
    const allTranslations = await getTranslations()
    console.log('✅ Languages:', languages, 'Pages:', Object.keys(allTranslations).length)
    
    const result: any = {}
    
    // Transform for each language
    languages.forEach(lang => {
      result[lang] = {}
      
      const recurse = (container: any): any => {
        if (container.isArray) {
          const arr: any[] = []
          const indices: number[] = []
          
          for (const s in container.spaces) {
            if (!isNaN(parseInt(s))) indices.push(parseInt(s))
          }
          for (const t in container.translations) {
            if (!isNaN(parseInt(t))) indices.push(parseInt(t))
          }
          
          if (indices.length > 0) {
            const maxIndex = Math.max(...indices)
            for (let i = 0; i <= maxIndex; i++) {
              const key = String(i)
              if (container.spaces[key]) {
                arr[i] = recurse(container.spaces[key])
              } else if (container.translations[key]) {
                arr[i] = container.translations[key][lang] || ""
              } else {
                arr[i] = null
              }
            }
          }
          return arr
        }
        
        const res: any = {}
        for (const s in container.spaces) {
          res[s] = recurse(container.spaces[s])
        }
        for (const t in container.translations) {
          res[t] = container.translations[t][lang] || ""
        }
        return res
      }
      
      for (const pageKey in allTranslations) {
        result[lang][pageKey] = recurse(allTranslations[pageKey])
      }
    })
    
    console.log('📤 Response sent with', Object.keys(result).length, 'languages')
    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('❌ Error fetching all translations:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch translations', 
        message: error.message 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

