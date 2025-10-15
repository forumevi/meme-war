"use client"; // 👈 BU SATIRI EN ÜSTE EKLE

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

  return <div>Meme War</div>;
}
