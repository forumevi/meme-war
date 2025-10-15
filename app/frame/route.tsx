import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const state = url.searchParams.get('state') || 'start';
  const body = await req.json();
  const buttonIndex = body?.untrustedData?.buttonIndex;

  const MEMES = ["Distracted Boyfriend", "This Is Fine", "Drake Hotline Bling"];
  const AI = [
    "AI used 'This Is Fine'... but it's not fine 😅",
    "AI countered with Drake! Classic move.",
    "AI threw a cat meme. You win by default.",
    "AI tried to confuse you... but you saw through it!",
    "AI surrendered to your meme power! 💪"
  ];

  if (state === 'start') {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.VERCEL_URL}/api/image?text=Choose%20your%20meme%20weapon!" />
          <meta property="fc:frame:button:1" content="${MEMES[0]}" />
          <meta property="fc:frame:button:2" content="${MEMES[1]}" />
          <meta property="fc:frame:button:3" content="${MEMES[2]}" />
          <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/frame?state=battle" />
        </head>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  if (state === 'battle') {
    const user = MEMES[buttonIndex - 1] || "Unknown";
    const ai = AI[Math.floor(Math.random() * AI.length)];
    const text = `You used: ${user}\n${ai}\n\nYou WIN! 🏆`;
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.VERCEL_URL}/api/image?text=${encodeURIComponent(text)}" />
          <meta property="fc:frame:button:1" content="Share Victory!" />
          <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/frame?state=share" />
        </head>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  if (state === 'share') {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.VERCEL_URL}/api/image?text=Your%20victory%20is%20posted!%20⚔️" />
          <meta property="fc:frame:button:1" content="Play Again!" />
          <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/frame?state=start" />
          <meta property="fc:frame:post_url:target" content="social" />
        </head>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  return new NextResponse('Bad Request', { status: 400 });
}
