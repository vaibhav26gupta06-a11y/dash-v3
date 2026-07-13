import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'versions/' })

    const versions = await Promise.all(
      blobs
        .sort((a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )
        .map(async blob => {
          const timestamp = blob.pathname
            .replace('versions/', '')
            .replace('.json', '')
          try {
            const { download } = await import('@vercel/blob')
            const res = await download(blob.url)
            const text = await res.text()
            const payload = JSON.parse(text)
            return {
              timestamp,
              label: payload.label || timestamp,
              uploadedAt: blob.uploadedAt,
            }
          } catch {
            return {
              timestamp,
              label: timestamp,
              uploadedAt: blob.uploadedAt,
            }
          }
        })
    )

    return NextResponse.json({ versions })

  } catch (error: any) {
    console.error('Versions fetch error:', error)
    return NextResponse.json({ versions: [] })
  }
}
