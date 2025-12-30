/**
 * useWaveSurfer Hook - Unit Tests
 * 
 * Tests unitarios para el hook useWaveSurfer:
 * - Inicialización correcta de WaveSurfer
 * - Manejo de eventos (ready, play, pause, timeupdate, error)
 * - Cleanup y destrucción segura
 * - Manejo de errores (AbortError, load errors)
 * - Actualización de estados
 * - Métodos: togglePlay, seekTo
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWaveSurfer } from '../use-wavesurfer';
import { useRef } from 'react';

// Mock WaveSurfer.js
const mockPlayPause = vi.fn();
const mockDestroy = vi.fn();
const mockUnAll = vi.fn();
const mockGetDuration = vi.fn(() => 180); // 3 minutos
const mockSeekTo = vi.fn();
const mockLoad = vi.fn(() => Promise.resolve());
const mockOn = vi.fn();

const mockWaveSurferInstance = {
  playPause: mockPlayPause,
  destroy: mockDestroy,
  unAll: mockUnAll,
  getDuration: mockGetDuration,
  seekTo: mockSeekTo,
  load: mockLoad,
  on: mockOn,
};

vi.mock('wavesurfer.js', () => ({
  default: {
    create: vi.fn(() => mockWaveSurferInstance),
  },
}));

describe('useWaveSurfer Hook', () => {
  let containerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Crear un container ref mockeado
    containerRef = {
      current: document.createElement('div'),
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Inicialización', () => {
    it('should create WaveSurfer instance with container ref', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(WaveSurfer.create).toHaveBeenCalledWith(
          expect.objectContaining({
            container: containerRef.current,
          })
        );
      });
    });

    it('should merge custom options with defaults', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      const customOptions = {
        waveColor: '#ff0000',
        progressColor: '#00ff00',
        height: 120,
      };
      
      renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
        options: customOptions,
      }));
      
      await waitFor(() => {
        expect(WaveSurfer.create).toHaveBeenCalledWith(
          expect.objectContaining({
            container: containerRef.current,
            ...customOptions,
          })
        );
      });
    });

    it('should not create instance if container is null', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      const nullRef = { current: null };
      
      renderHook(() => useWaveSurfer({
        containerRef: nullRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(WaveSurfer.create).not.toHaveBeenCalled();
      });
    });

    it('should load audio URL after initialization', async () => {
      renderHook(() => useWaveSurfer({
        containerRef,
        url: '/audio/sample.wav',
      }));
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio/sample.wav');
      });
    });

    it('should not load if no URL provided', async () => {
      renderHook(() => useWaveSurfer({
        containerRef,
      }));
      
      await waitFor(() => {
        expect(mockLoad).not.toHaveBeenCalled();
      });
    });
  });

  describe('Event Listeners', () => {
    it('should register all required event listeners', async () => {
      renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(mockOn).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('play', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('pause', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('timeupdate', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
      });
    });

    it('should update isReady state on ready event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      expect(result.current.isReady).toBe(false);
      
      // Simular evento 'ready'
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });

    it('should update duration on ready event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      expect(result.current.duration).toBe(0);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(result.current.duration).toBe(180); // mockGetDuration retorna 180
      });
    });

    it('should clear error on ready event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      // Simular un error primero
      const errorCallback = mockOn.mock.calls.find(call => call[0] === 'error')?.[1];
      if (errorCallback) errorCallback('Some error');
      
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
      
      // Luego simular ready
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('should update isPlaying on play event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      expect(result.current.isPlaying).toBe(false);
      
      const playCallback = mockOn.mock.calls.find(call => call[0] === 'play')?.[1];
      if (playCallback) playCallback();
      
      await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
      });
    });

    it('should update isPlaying on pause event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      // Simular play primero
      const playCallback = mockOn.mock.calls.find(call => call[0] === 'play')?.[1];
      if (playCallback) playCallback();
      
      await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
      });
      
      // Luego pause
      const pauseCallback = mockOn.mock.calls.find(call => call[0] === 'pause')?.[1];
      if (pauseCallback) pauseCallback();
      
      await waitFor(() => {
        expect(result.current.isPlaying).toBe(false);
      });
    });

    it('should update currentTime on timeupdate event', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      expect(result.current.currentTime).toBe(0);
      
      const timeUpdateCallback = mockOn.mock.calls.find(
        call => call[0] === 'timeupdate'
      )?.[1];
      
      if (timeUpdateCallback) timeUpdateCallback(45.5);
      
      await waitFor(() => {
        expect(result.current.currentTime).toBe(45.5);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle WaveSurfer internal errors', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      const errorCallback = mockOn.mock.calls.find(call => call[0] === 'error')?.[1];
      if (errorCallback) errorCallback('Decoding failed');
      
      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'WaveSurfer internal error:',
          'Decoding failed'
        );
        // El hook guarda el error como string
        expect(result.current.error).toContain('Decoding failed');
      });
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle error objects', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      const errorCallback = mockOn.mock.calls.find(call => call[0] === 'error')?.[1];
      const errorObj = { code: 'ERR_DECODE', message: 'Cannot decode' };
      
      if (errorCallback) errorCallback(errorObj);
      
      await waitFor(() => {
        // El hook extrae el mensaje del objeto de error
        expect(result.current.error).toBe('Cannot decode');
      });
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle audio load errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockLoad.mockRejectedValueOnce(new Error('Network error'));
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/invalid.wav',
      }));
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error cargando audio:',
          expect.any(Error)
        );
        expect(result.current.error).toContain('No se pudo cargar el audio');
      });
      
      consoleErrorSpy.mockRestore();
      mockLoad.mockResolvedValue(undefined); // Restore
    });

    it('should ignore AbortError during load', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      mockLoad.mockRejectedValueOnce(abortError);
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        // No debe establecer error ni loguear
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(result.current.error).toBeNull();
      });
      
      consoleErrorSpy.mockRestore();
      mockLoad.mockResolvedValue(undefined); // Restore
    });
  });

  describe('Methods', () => {
    it('should call playPause on togglePlay', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(result.current.wavesurfer).toBeDefined();
      });
      
      result.current.togglePlay();
      
      expect(mockPlayPause).toHaveBeenCalledTimes(1);
    });

    it('should call seekTo with correct progress', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(result.current.wavesurfer).toBeDefined();
      });
      
      result.current.seekTo(0.5); // 50%
      
      expect(mockSeekTo).toHaveBeenCalledWith(0.5);
    });

    it('should handle togglePlay when wavesurfer is null', () => {
      const nullRef = { current: null };
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef: nullRef,
        url: '/test.wav',
      }));
      
      // No debe lanzar error
      expect(() => result.current.togglePlay()).not.toThrow();
      expect(mockPlayPause).not.toHaveBeenCalled();
    });

    it('should handle seekTo when wavesurfer is null', () => {
      const nullRef = { current: null };
      
      const { result } = renderHook(() => useWaveSurfer({
        containerRef: nullRef,
        url: '/test.wav',
      }));
      
      // No debe lanzar error
      expect(() => result.current.seekTo(0.3)).not.toThrow();
      expect(mockSeekTo).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', async () => {
      const { unmount } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(mockWaveSurferInstance).toBeDefined();
      });
      
      unmount();
      
      expect(mockUnAll).toHaveBeenCalled();
      expect(mockDestroy).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      
      mockDestroy.mockImplementationOnce(() => {
        throw new Error('Destroy failed');
      });
      
      const { unmount } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(mockWaveSurferInstance).toBeDefined();
      });
      
      // No debe lanzar error
      expect(() => unmount()).not.toThrow();
      
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        'Error durante cleanup de WaveSurfer (ignorable):',
        expect.any(Error)
      );
      
      consoleDebugSpy.mockRestore();
      mockDestroy.mockRestore();
    });

    it('should recreate instance when dependencies change', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      const { rerender } = renderHook(
        ({ url }) => useWaveSurfer({ containerRef, url }),
        { initialProps: { url: '/audio1.wav' } }
      );
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio1.wav');
      });
      
      const firstCallCount = (WaveSurfer.create as any).mock.calls.length;
      
      // Cambiar URL
      rerender({ url: '/audio2.wav' });
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio2.wav');
        expect((WaveSurfer.create as any).mock.calls.length).toBe(firstCallCount + 1);
      });
    });
  });

  describe('Return Values', () => {
    it('should return all required properties', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      await waitFor(() => {
        expect(result.current).toHaveProperty('wavesurfer');
        expect(result.current).toHaveProperty('isPlaying');
        expect(result.current).toHaveProperty('isReady');
        expect(result.current).toHaveProperty('currentTime');
        expect(result.current).toHaveProperty('duration');
        expect(result.current).toHaveProperty('error');
        expect(result.current).toHaveProperty('togglePlay');
        expect(result.current).toHaveProperty('seekTo');
      });
    });

    it('should have correct initial values', () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.isReady).toBe(false);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.togglePlay).toBe('function');
      expect(typeof result.current.seekTo).toBe('function');
    });

    it('should provide access to wavesurfer methods', async () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '/test.wav',
      }));
      
      // Verificar que los métodos del hook están disponibles
      expect(typeof result.current.togglePlay).toBe('function');
      expect(typeof result.current.seekTo).toBe('function');
      
      // Llamar a togglePlay funciona incluso si wavesurfer es null (no lanza error)
      expect(() => result.current.togglePlay()).not.toThrow();
      expect(() => result.current.seekTo(0.5)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid URL changes', async () => {
      const { rerender } = renderHook(
        ({ url }) => useWaveSurfer({ containerRef, url }),
        { initialProps: { url: '/audio1.wav' } }
      );
      
      // Cambiar URL rápidamente
      rerender({ url: '/audio2.wav' });
      rerender({ url: '/audio3.wav' });
      rerender({ url: '/audio4.wav' });
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio4.wav');
      });
    });

    it('should handle undefined URL', () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
      }));
      
      expect(result.current.wavesurfer).toBeDefined();
      expect(mockLoad).not.toHaveBeenCalled();
    });

    it('should handle empty URL', () => {
      const { result } = renderHook(() => useWaveSurfer({
        containerRef,
        url: '',
      }));
      
      expect(mockLoad).not.toHaveBeenCalled();
    });
  });
});
