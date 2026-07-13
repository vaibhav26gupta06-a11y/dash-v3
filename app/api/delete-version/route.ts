import { list, del, put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { timestamp, password } = body

    const correctPassword = process.env.UPLOAD_PASSWORD
    if (!correctPassword || password !== correctPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    if (!timestamp) {
      return NextResponse.json(
        { error: 'No version specified' },
        { status: 400 }
      )
    }

    const key = `versions/${timestamp}.json`
    const { blobs } = await list({ prefix: key })
    const blob = blobs.find(b => b.pathname === key)

    if (!blob) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      )
    }

    await del(blob.url)

    // After deletion, update latest.json to next most recent version
    const { blobs: remaining } = await list({ prefix: 'versions/' })
    const sorted = remaining
      .sort((a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )

    if (sorted.length > 0) {
      const latestRes = await fetch(sorted[0].url)
      const latestPayload = await latestRes.json()
      await put('latest.json', JSON.stringify(latestPayload), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      })
    } else {
      // No versions left — delete latest.json
      const { blobs: latestBlobs } = await list({ prefix: 'latest.json' })
      if (latestBlobs.length > 0) {
        await del(latestBlobs[0].url)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
