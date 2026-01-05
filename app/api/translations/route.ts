import { NextResponse } from 'next/server'
import { getLanguages, getTranslations } from '@/lib/firestore'

// Get all available languages
export async function GET() {
  try {
    console.log('📥 API Request: GET /api/translations')
    const languages = await getLanguages()
    console.log('✅ Languages fetched:', languages)
    
    const response = NextResponse.json(
      { languages: languages || [] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
    
    console.log('📤 Response sent:', { languages: languages || [] })
    return response
  } catch (error: any) {
    console.error('❌ Error fetching languages:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch languages', 
        message: error.message,
        languages: [] 
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

