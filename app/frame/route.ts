import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, getFrameHtml } from 'frame.js';

const MEMES = [
  { id: 1, name: "Distracted Boyfriend", url: "/memes/1.jpg" },
  { id: 2, name: "This Is Fine", url: "/memes/2.jpg" },
  { id: 3, name: "Drake Hotline Bling", url: "/memes/3.jpg" },
  { id: 4, name: "Woman Yelling at Cat", url: "/memes/4.jpg" },
  { id: 5, name: "Two Buttons", url: "/memes/5.jpg" },
];

const AI_RESPONSES = [
  "AI used 'This Is Fine'... but it's not fine 😅",
  "AI countered with Drake! Classic move.",
  "AI threw a cat meme. You win by default.",
  "AI tried to confuse you... but you saw through it!",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'start';

  try {
    const frameMessage = await getFrameMessage(body);

    if (state === 'start') {
      // Silah seçimi ekranı
      const buttons = MEMES.slice(0, 3).map(m => m.name);
      return new NextResponse(
        getFrameHtml({
          buttons,
          image: {
            src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Choose%20your%20meme%20weapon!`,
          },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=battle`,
        })
      );
    }

    if (state === 'battle') {
      const userChoice = frameMessage?.button as string;
      const aiChoice = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const resultText = `You used: ${userChoice}\n${aiChoice}\n\nYou WIN! 🏆`;

      // Otomatik cast için paylaşım butonu
      return new NextResponse(
        getFrameHtml({
          buttons: ['Share Victory!'],
          image: {
            src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=${encodeURIComponent(resultText)}`,
          },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=share`,
        })
      );
    }

    if (state === 'share') {
      // Warpcast'ta paylaşım için özel post_url
      return new NextResponse(
        getFrameHtml({
          buttons: ['Play Again!'],
          image: {
            src: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/image?text=Your%20victory%20is%20posted!%20⚔️`,
          },
          postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/frame?state=start`,
          postUrlTarget: 'social', // Bu, Warpcast'a otomatik cast attırır!
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
