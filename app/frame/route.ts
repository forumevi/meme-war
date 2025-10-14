import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, getFrameHtml } from 'frame.js';

const MEMES = ["Distracted Boyfriend", "This Is Fine", "Drake Hotline Bling"];

const AI_RESPONSES = [
  "AI used 'This Is Fine'... but it's not fine 😅",
  "AI countered with Drake! Classic move.",
  "AI threw a cat meme. You win by default.",
  "AI tried to confuse you... but you saw through it!",
  "AI surrendered to your meme power! 💪",
];

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'start';

  try {
    const frameMessage = await getFrameMessage(await req.json());

    if (state === 'start') {
      return new NextResponse(
        getFrameHtml({
          buttons: MEMES,
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Choose%20your%20meme%20weapon!` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=battle`,
        })
      );
    }

    if (state === 'battle') {
      const userChoice = frameMessage?.button as string;
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const resultText = `You used: ${userChoice}\n${aiResponse}\n\nYou WIN! 🏆`;

      return new NextResponse(
        getFrameHtml({
          buttons: ['Share Victory!'],
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=${encodeURIComponent(resultText)}` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=share`,
        })
      );
    }

    if (state === 'share') {
      return new NextResponse(
        getFrameHtml({
          buttons: ['Play Again!'],
          image: { src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Your%20victory%20is%20posted!%20⚔️` },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=start`,
          postUrlTarget: 'social',
        })
      );
    }

    return new NextResponse('Bad Request', { status: 400 });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
