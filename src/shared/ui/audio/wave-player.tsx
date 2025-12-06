'use client';

import { useRef, useMemo } from 'react';
import { useWaveSurfer } from '@/shared/hooks/use-wavesurfer';
import { Button } from '@/shared/ui/button'; // Tu botón existente
import { Play, Pause, Loader2 } from 'lucide-react'; // Iconos ejemplo
import { cn } from '@/shared/utils/cn';

interface WavePlayerProps {
  url: string;
  className?: string;
  height?: number;
}

export const WavePlayer = ({ url, className, height = 80 }: WavePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Configuración visual alineada a "Nebula Glass"
  // Usamos los colores hexadecimales de tu paleta directamente o vía variables CSS
  const waveOptions = useMemo(() => ({
    waveColor: 'rgba(152, 88, 202, 0.4)', // accent-secondary (púrpura medio)
    progressColor: '#007cff',             // primary (azul eléctrico)
    cursorColor: '#cca5eb',               // accent-tertiary
    barWidth: 2,
    barGap: 3,
    barRadius: 3,
    height: height,
    normalize: true,
    grid: true, // Opcional, si quieres líneas de tiempo
  }), [height]);

  const { isPlaying, isReady, togglePlay, currentTime, duration } = useWaveSurfer({
    containerRef,
    url,
    options: waveOptions
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "glass-panel p-4 flex flex-col gap-4 w-full", // Clase base de tu Design System
      className
    )}>
      
      {/* Contenedor WaveSurfer */}
      <div className="relative w-full rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
        
        {/* Spinner de carga */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-light-base/50 dark:bg-dark-deep/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        )}

        {/* El Canvas real */}
        <div ref={containerRef} className="w-full" />
      </div>

      {/* Controles Glass */}
      <div className="flex items-center justify-between">
        <Button 
          variant="solid" // Usamos solid para el CTA principal
          size="icon" 
          onClick={togglePlay}
          disabled={!isReady}
          className="rounded-full w-12 h-12 shadow-lg shadow-primary-500/20"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </Button>

        {/* Timers con tipografía Glass */}
        <div className="glass-input px-4 py-1 flex items-center gap-2 text-sm font-mono">
          <span className="text-primary-500 font-bold">{formatTime(currentTime)}</span>
          <span className="text-gray-400">/</span>
          <span className="glass-text">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};