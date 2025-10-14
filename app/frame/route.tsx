import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'start';

  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex; // Warpcast buton verisi

    const MEMES = ["Distracted Boyfriend", "This Is Fine", "Drake Hotline Bling"];
    const AI_RESPONSES = [
      "AI used 'This Is Fine'... but it's not fine 😅",
      "AI countered with Drake! Classic move.",
      "AI threw a cat meme. You win by default.",
      "AI tried to confuse you... but you saw through it!",
      "AI surrendered to your meme power! 💪",
    ];

    if (state === 'start') {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Choose%20your%20meme%20weapon!" />
            <meta property="fc:frame:button:1" content="${MEMES[0]}" />
            <meta property="fc:frame:button:2" content="${MEMES[1]}" />
            <meta property="fc:frame:button:3" content="${MEMES[2]}" />
            <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=battle" />
          </head>
        </html>
      `;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    if (state === 'battle') {
      const userChoice = MEMES[buttonIndex - 1] || "Unknown Meme";
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const resultText = `You used: ${userChoice}\n${aiResponse}\n\nYou WIN! 🏆`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=${encodeURIComponent(resultText)}" />
            <meta property="fc:frame:button:1" content="Share Victory!" />
            <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=share" />
          </head>
        </html>
      `;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    if (state === 'share') {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Your%20victory%20is%20posted!%20⚔️" />
            <meta property="fc:frame:button:1" content="Play Again!" />
            <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=start" />
            <meta property="fc:frame:post_url:target" content="social" />
          </head>
        </html>
      `;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
    }

    return new NextResponse('Bad Request', { status: 400 });
  } catch (e) {
    console.error('Frame error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
