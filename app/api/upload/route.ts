import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, password, label } = body

    const correctPassword = process.env.UPLOAD_PASSWORD
    if (!correctPassword || password !== correctPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      )
    }

    const now = new Date()
    const timestamp = now.toISOString()
    const displayLabel = label || now.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })

    const payload = JSON.stringify({ data, timestamp, label: displayLabel })

    await put(`versions/${timestamp}.json`, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })

    await put('latest.json', payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true, timestamp, label: displayLabel })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
