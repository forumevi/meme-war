// app/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex;

    const MEMES = ["Distracted Boyfriend", "This Is Fine", "Drake Hotline Bling"];
    const AI_RESPONSES = [
      "AI used 'This Is Fine'... but it's not fine 😅",
      "AI countered with Drake! Classic move.",
      "AI threw a cat meme. You win by default.",
      "AI tried to confuse you... but you saw through it!",
      "AI surrendered to your meme power! 💪",
    ];

    if (!buttonIndex) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const userChoice = MEMES[buttonIndex - 1] || "Unknown Meme";
    const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    const resultText = `You used: ${userChoice}\n${aiResponse}\n\nYou WIN! 🏆`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.VERCEL_URL}/api/image?text=${encodeURIComponent(resultText)}" />
          <meta property="fc:frame:button:1" content="Share Victory!" />
          <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/frame?state=share" />
        </head>
      </html>
    `;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
