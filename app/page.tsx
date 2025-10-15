// app/page.tsx
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sdk = (window as any).FarcasterMiniApp;
      if (sdk) {
        sdk.actions.ready(); // 👈 Bu satır zorunlu!
      }
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
