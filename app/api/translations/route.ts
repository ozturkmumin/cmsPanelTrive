import { NextResponse } from 'next/server'
import { getLanguages, getTranslations } from '@/lib/firestore'

// Get all available languages
export async function GET() {
  try {
    const languages = await getLanguages()
    
    return NextResponse.json(
      { languages },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch languages', message: error.message },
      { status: 500 }
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

