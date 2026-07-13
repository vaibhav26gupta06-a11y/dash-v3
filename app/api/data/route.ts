import { list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get('version')

    const key = version ? `versions/${version}.json` : 'latest.json'

    const { blobs } = await list({ prefix: key })
    const blob = blobs.find(b => b.pathname === key)

    if (!blob) {
      return NextResponse.json({ data: null, timestamp: null, label: null })
    }

    const { download } = await import('@vercel/blob')
    const response = await download(blob.url)
    const text = await response.text()
    const payload = JSON.parse(text)

    return NextResponse.json(payload)

  } catch (error: any) {
    console.error('Data fetch error:', error)
    return NextResponse.json({ data: null, timestamp: null, label: null })
  }
}
