import type { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')! : 'Bangers'

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            color: 'white',
          }}
        >
          <span role="img" aria-label="Butterfly">
            🦋
          </span>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: '-0.05em',
              marginLeft: '0.1em',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }
  catch (e: any) {
    console.error(`Error generating OG image: ${e.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
