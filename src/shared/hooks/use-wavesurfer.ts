// src/shared/hooks/use-wavesurfer.ts
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { WaveSurferOptions } from 'wavesurfer.js';

interface UseWaveSurferProps {
  // Corrección de tipo para permitir null inicial
  containerRef: React.RefObject<HTMLDivElement | null>;
  url?: string;
  options?: Omit<WaveSurferOptions, 'container'>;
}

export function useWaveSurfer({ containerRef, url, options }: UseWaveSurferProps) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear instancia
    const ws = WaveSurfer.create({
      container: containerRef.current,
      ...options,
    });

    wavesurferRef.current = ws;

    // --- Event Listeners ---
    
    ws.on('ready', () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      setError(null); // Limpiar errores si carga bien
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('timeupdate', (currentTime) => setCurrentTime(currentTime));
    
    // Capturar errores internos de WaveSurfer (ej. decodificación)
    ws.on('error', (err) => {
        console.warn('WaveSurfer internal error:', err);
        setError(typeof err === 'string' ? err : 'Error al cargar audio');
    });

    // --- Carga de Audio Robusta ---
    if (url) {
      // Usamos .catch aquí para evitar que el AbortError rompa la app
      ws.load(url).catch((err) => {
        // Ignoramos AbortError (es normal al desmontar el componente)
        if (err.name === 'AbortError') return;
        
        console.error('Error cargando audio:', err);
        setError(`No se pudo cargar el audio: ${err.message}`);
      });
    }

    // --- Cleanup Seguro ---
    return () => {
      try {
        // Cancelamos suscripciones primero
        ws.unAll();
        // Destruimos la instancia
        ws.destroy();
      } catch (e) {
        // Ignoramos errores durante la destrucción
        console.debug('Error durante cleanup de WaveSurfer (ignorable):', e);
      }
      wavesurferRef.current = null;
    };
  }, [containerRef, options, url]);

  const togglePlay = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const seekTo = useCallback((progress: number) => {
    wavesurferRef.current?.seekTo(progress);
  }, []);

  return {
    wavesurfer: wavesurferRef.current,
    isPlaying,
    isReady,
    currentTime,
    duration,
    error, // Exponemos el error para mostrarlo en UI
    togglePlay,
    seekTo
  };
}