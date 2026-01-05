import { NextRequest, NextResponse } from 'next/server'
import { getTranslations, getLanguages } from '@/lib/firestore'

// Get translations for a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang')?.toLowerCase()
    const pageKey = params.pageKey
    
    console.log('📥 API Request: GET /api/translations/page/[pageKey]', { pageKey, lang })
    
    const languages = await getLanguages()
    const allTranslations = await getTranslations()
    console.log('✅ Languages:', languages, 'Pages:', Object.keys(allTranslations).length)
    
    const pageData = allTranslations[pageKey]
    
    if (!pageData) {
      console.log('⚠️ Page not found:', pageKey)
      return NextResponse.json(
        { 
          error: `Page '${pageKey}' not found`,
          availablePages: Object.keys(allTranslations)
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
    
    // If lang is specified, return only that language
    if (lang) {
      if (!languages.includes(lang)) {
        console.log('⚠️ Language not found:', lang, 'Available:', languages)
        return NextResponse.json(
          { 
            error: `Language '${lang}' not found. Available languages: ${languages.join(', ') || 'none'}`,
            availableLanguages: languages
          },
          { 
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
      }
      
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
      
      const result = recurse(pageData)
      console.log('📤 Response sent for page:', pageKey, 'lang:', lang)
      return NextResponse.json(result, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    
    // If no lang specified, return all languages for this page
    const result: any = {}
    languages.forEach(l => {
      result[l] = {}
      
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
                arr[i] = container.translations[key][l] || ""
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
          res[t] = container.translations[t][l] || ""
        }
        return res
      }
      
      result[l] = recurse(pageData)
    })
    
    console.log('📤 Response sent for page:', pageKey, 'all languages')
    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('❌ Error fetching page translations:', error)
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

