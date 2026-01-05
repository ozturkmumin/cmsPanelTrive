import { NextRequest, NextResponse } from 'next/server'
import { getTranslations, getLanguages } from '@/lib/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  try {
    const lang = params.lang.toLowerCase()
    console.log('📥 API Request: GET /api/translations/[lang]', { lang })
    
    // Get all languages to verify the requested language exists
    const languages = await getLanguages()
    console.log('✅ Languages fetched:', languages)
    
    // Get translations for the requested language
    const allTranslations = await getTranslations()
    console.log('✅ Translations fetched, pages:', Object.keys(allTranslations).length)
    
    // Check if language exists in translations even if not in languages list
    const hasLanguageInData = (container: any): boolean => {
      if (container.translations) {
        for (const key in container.translations) {
          if (container.translations[key] && container.translations[key][lang] !== undefined) {
            return true
          }
        }
      }
      if (container.spaces) {
        for (const key in container.spaces) {
          if (hasLanguageInData(container.spaces[key])) {
            return true
          }
        }
      }
      return false
    }

    let languageExists = languages.includes(lang)
    if (!languageExists) {
      // Check if language exists in any translation data
      for (const pageKey in allTranslations) {
        if (hasLanguageInData(allTranslations[pageKey])) {
          languageExists = true
          break
        }
      }
    }
    
    if (!languageExists) {
      console.log('⚠️ Language not found:', lang, 'Available:', languages)
      // Return empty object instead of error
      return NextResponse.json(
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }
    
    // Transform to the export format (same as getTranslationsByLang)
    const result: any = { [lang]: {} }
    
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
    
    const responseData = result[lang]
    console.log('📤 Response data keys:', Object.keys(responseData))
    
    // Set CORS headers to allow cross-origin requests
    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('❌ Error fetching translations:', error)
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

