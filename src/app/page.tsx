'use client';

import dynamic from 'next/dynamic';
import { BackgroundWrapper } from '@/shared/ui/background-wrapper';

// Importación dinámica con SSR deshabilitado
const WavePlayer = dynamic(
  () => import('@/shared/ui/audio/wave-player').then(mod => mod.WavePlayer),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <BackgroundWrapper>
      <div className="max-w-3xl mx-auto p-10 space-y-8">
        <h1 className="text-3xl font-bold glass-text">Editor de Audio</h1>
        
        {/* El componente renderizado */}
        <WavePlayer 
          url="https://wavesurfer.xyz/wavesurfer-code/examples/audio/audio.wav" 
          height={120}
        />
        
      </div>
    </BackgroundWrapper>
  );
}