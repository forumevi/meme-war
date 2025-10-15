"use client";

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.farcaster.xyz/frame-sdk.js';
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).FarcasterFrameSDK?.ready();
      };
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Meme War: Solo Mode</h1>
      <p>This is a Farcaster MiniApp. Play it in Farcaster!</p>
      <p>Frame URL: <code>/frame</code></p>
    </div>
  );
}
