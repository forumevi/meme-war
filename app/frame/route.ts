import { NextRequest, NextResponse } from 'next/server';

const MEMES = ["Distracted Boyfriend", "This Is Fine", "Drake Hotline Bling"];
const AI_RESPONSES = [
  "AI used 'This Is Fine'... but it's not fine 😅",
  "AI countered with Drake! Classic move.",
  "AI threw a cat meme. You win by default.",
  "AI tried to confuse you... but you saw through it!",
  "AI surrendered to your meme power! 💪",
];

function getFrameHtml({
  buttons,
  image,
  postUrl,
  postUrlTarget,
}: {
  buttons: string[];
  image: { src: string };
  postUrl: string;
  postUrlTarget?: 'social';
}) {
  const buttonTags = buttons.map((text, i) => 
    `<button index="${i + 1}">${text}</button>`
  ).join('');

  const postUrlTargetAttr = postUrlTarget === 'social' 
    ? 'fc:frame:post_url:target="social"' 
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Meme War</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image.src}" />
        ${buttons.map((_, i) => `<meta property="fc:frame:button:${i + 1}" content="${buttons[i]}" />`).join('\n        ')}
        <meta property="fc:frame:post_url" content="${postUrl}" />
        ${postUrlTargetAttr ? `<meta property="fc:frame:post_url:target" content="social" />` : ''}
      </head>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'start';

  try {
    const body = await req.json();
    const frameMessage = body?.untrustedData?.buttonIndex;

    if (state === 'start') {
      return new NextResponse(
        getFrameHtml({
          buttons: MEMES,
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Choose%20your%20meme%20weapon!` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=battle`,
        }),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (state === 'battle') {
      const userChoice = MEMES[frameMessage - 1] || "Unknown Meme";
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const resultText = `You used: ${userChoice}\n${aiResponse}\n\nYou WIN! 🏆`;

      return new NextResponse(
        getFrameHtml({
          buttons: ['Share Victory!'],
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=${encodeURIComponent(resultText)}` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=share`,
        }),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (state === 'share') {
      return new NextResponse(
        getFrameHtml({
          buttons: ['Play Again!'],
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Your%20victory%20is%20posted!%20⚔️` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=start`,
          postUrlTarget: 'social',
        }),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new NextResponse('Bad Request', { status: 400 });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
