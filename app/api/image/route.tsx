// app/api/image/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import React from 'react'; // 👈 BU ZORUNLU

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'Meme War';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f0f',
          color: 'white',
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div>{text.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
        <div style={{ marginTop: 40, fontSize: 24, opacity: 0.7 }}>Meme War • Solo Mode</div>
      </div>
    ),
    {
      width: 1146,
      height: 600,
    }
  );
}
