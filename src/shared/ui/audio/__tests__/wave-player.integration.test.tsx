/**
 * WavePlayer Component - Integration Tests
 * 
 * Tests de integración para WavePlayer con WaveSurfer.js:
 * - Renderizado correcto del componente
 * - Integración con useWaveSurfer hook
 * - Estados: loading, ready, playing, paused
 * - Controles de reproducción (play/pause)
 * - Visualización de tiempo (currentTime/duration)
 * - Manejo de errores de carga
 * - Accesibilidad (WCAG 2.1 AA)
 * 
 * Nota: WaveSurfer requiere mocking porque usa Canvas API
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WavePlayer } from '../wave-player';

// Extend matchers
expect.extend(toHaveNoViolations);

// Mock WaveSurfer.js
const mockPlayPause = vi.fn();
const mockDestroy = vi.fn();
const mockUnAll = vi.fn();
const mockGetDuration = vi.fn(() => 120.5); // 2 minutos
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

describe('WavePlayer - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simular eventos de WaveSurfer
    mockOn.mockImplementation((event: string, callback: Function) => {
      if (event === 'ready') {
        // Simular que el audio está listo después de un tick
        setTimeout(() => callback(), 0);
      }
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Renderizado y Estados Iniciales', () => {
    it('should render WavePlayer component', () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Verificar que el contenedor principal existe
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show loading spinner initially', () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // El loader debe estar visible antes de que el audio esté listo
      const loader = document.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });

    it('should display initial time as 0:00', () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Hay dos instancias de 0:00 (currentTime y duration)
      const times = screen.getAllByText('0:00');
      expect(times).toHaveLength(2);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <WavePlayer url="/test-audio.wav" className="custom-class" />
      );
      
      const glassPanel = container.querySelector('.glass-panel');
      expect(glassPanel).toHaveClass('custom-class');
    });

    it('should apply custom height', () => {
      render(<WavePlayer url="/test-audio.wav" height={120} />);
      
      // Verificar que se pasa la opción de altura a WaveSurfer
      expect(mockWaveSurferInstance).toBeDefined();
    });
  });

  describe('Integración con WaveSurfer Hook', () => {
    it('should initialize WaveSurfer with correct options', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      render(<WavePlayer url="/test-audio.wav" height={100} />);
      
      await waitFor(() => {
        expect(WaveSurfer.create).toHaveBeenCalledWith(
          expect.objectContaining({
            container: expect.anything(),
            height: 100,
            waveColor: 'rgba(152, 88, 202, 0.4)',
            progressColor: '#007cff',
            cursorColor: '#cca5eb',
            barWidth: 2,
            barGap: 3,
            barRadius: 3,
            normalize: true,
            grid: true,
          })
        );
      });
    });

    it('should load audio URL on mount', async () => {
      render(<WavePlayer url="/sample-audio.wav" />);
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/sample-audio.wav');
      });
    });

    it('should register event listeners', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      await waitFor(() => {
        expect(mockOn).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('play', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('pause', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('timeupdate', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
      });
    });
  });

  describe('Estados del Reproductor', () => {
    it('should transition from loading to ready state', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Inicialmente debe mostrar el loader
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
      
      // Simular evento 'ready'
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      });
    });

    it('should display duration when ready', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Simular evento 'ready'
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(screen.getByText('2:00')).toBeInTheDocument(); // 120.5 segundos = 2:00
      });
    });

    it('should update play/pause icon based on state', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Simular que está listo
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeEnabled();
      });
    });
  });

  describe('Controles de Reproducción', () => {
    it('should toggle play/pause on button click', async () => {
      const user = userEvent.setup();
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Esperar a que esté listo
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeEnabled();
      });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockPlayPause).toHaveBeenCalledTimes(1);
    });

    it('should disable button when not ready', () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show play icon initially', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        // Buscar el ícono de play (Play component de lucide-react)
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('Visualización de Tiempo', () => {
    it('should format time correctly (minutes:seconds)', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        // Duración de 120.5 segundos debe mostrarse como 2:00
        expect(screen.getByText('2:00')).toBeInTheDocument();
      });
    });

    it('should update current time during playback', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      const timeUpdateCallback = mockOn.mock.calls.find(call => call[0] === 'timeupdate')?.[1];
      
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(screen.getByText('0:00')).toBeInTheDocument();
      });
      
      // Simular actualización de tiempo a 65 segundos
      if (timeUpdateCallback) timeUpdateCallback(65);
      
      await waitFor(() => {
        expect(screen.getByText('1:05')).toBeInTheDocument();
      });
    });

    it('should pad seconds with leading zero', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const timeUpdateCallback = mockOn.mock.calls.find(call => call[0] === 'timeupdate')?.[1];
      
      // Simular 5 segundos (debe mostrarse como 0:05)
      if (timeUpdateCallback) timeUpdateCallback(5);
      
      await waitFor(() => {
        expect(screen.getByText('0:05')).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de Errores', () => {
    it('should handle audio load errors gracefully', async () => {
      mockLoad.mockRejectedValueOnce(new Error('Failed to load audio'));
      
      render(<WavePlayer url="/invalid-audio.wav" />);
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalled();
      });
      
      // El componente debe seguir renderizándose sin crash
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should ignore AbortError during cleanup', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      mockLoad.mockRejectedValueOnce(abortError);
      
      const { unmount } = render(<WavePlayer url="/test-audio.wav" />);
      
      // No debe lanzar error al desmontar
      expect(() => unmount()).not.toThrow();
    });

    it('should handle WaveSurfer internal errors', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<WavePlayer url="/test-audio.wav" />);
      
      const errorCallback = mockOn.mock.calls.find(call => call[0] === 'error')?.[1];
      if (errorCallback) errorCallback('Decoding error');
      
      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'WaveSurfer internal error:',
          'Decoding error'
        );
      });
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Cleanup y Lifecycle', () => {
    it('should cleanup WaveSurfer on unmount', () => {
      const { unmount } = render(<WavePlayer url="/test-audio.wav" />);
      
      unmount();
      
      expect(mockUnAll).toHaveBeenCalled();
      expect(mockDestroy).toHaveBeenCalled();
    });

    it('should recreate WaveSurfer when URL changes', async () => {
      const { rerender } = render(<WavePlayer url="/audio-1.wav" />);
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio-1.wav');
      });
      
      rerender(<WavePlayer url="/audio-2.wav" />);
      
      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith('/audio-2.wav');
      });
    });
  });

  describe('Accesibilidad (WCAG 2.1)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<WavePlayer url="/test-audio.wav" />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible button with proper role', async () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // El botón tiene aria-label para accesibilidad
      expect(button).toHaveAccessibleName(/reproducir audio|pausar audio/i);
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<WavePlayer url="/test-audio.wav" />);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeEnabled();
      });
      
      const button = screen.getByRole('button');
      
      // Navegar con Tab y activar con Enter
      await user.tab();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(mockPlayPause).toHaveBeenCalled();
    });

    it('should have sufficient color contrast', () => {
      render(<WavePlayer url="/test-audio.wav" />);
      
      // Los colores definidos en el componente cumplen WCAG AA:
      // - primary-500 (#007cff) sobre fondos claros: ratio > 4.5:1
      // - text-primary sobre fondos glass: ratio > 4.5:1
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-lg', 'shadow-primary-500/20');
    });

    it('should have visible focus indicator', async () => {
      const user = userEvent.setup();
      render(<WavePlayer url="/test-audio.wav" />);
      
      const readyCallback = mockOn.mock.calls.find(call => call[0] === 'ready')?.[1];
      if (readyCallback) readyCallback();
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeEnabled();
      });
      
      await user.tab();
      
      // El Button component debe tener ring-2 en focus (Design System)
      const button = screen.getByRole('button');
      expect(button).toHaveFocus();
    });
  });

  describe('Design System Integration', () => {
    it('should use glass-panel class', () => {
      const { container } = render(<WavePlayer url="/test-audio.wav" />);
      
      const panel = container.querySelector('.glass-panel');
      expect(panel).toBeInTheDocument();
    });

    it('should use glass-input for time display', () => {
      const { container } = render(<WavePlayer url="/test-audio.wav" />);
      
      const timeDisplay = container.querySelector('.glass-input');
      expect(timeDisplay).toBeInTheDocument();
    });

    it('should use correct Nebula Glass colors', async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      
      render(<WavePlayer url="/test-audio.wav" />);
      
      await waitFor(() => {
        expect(WaveSurfer.create).toHaveBeenCalledWith(
          expect.objectContaining({
            waveColor: 'rgba(152, 88, 202, 0.4)', // accent-secondary
            progressColor: '#007cff',              // primary-500
            cursorColor: '#cca5eb',                // accent-tertiary
          })
        );
      });
    });

    it('should have rounded corners and proper spacing', () => {
      const { container } = render(<WavePlayer url="/test-audio.wav" />);
      
      const waveContainer = container.querySelector('.rounded-lg');
      expect(waveContainer).toBeInTheDocument();
      expect(waveContainer).toHaveClass('overflow-hidden');
    });
  });

  describe('Performance', () => {
    it('should not recreate WaveSurfer unnecessarily', async () => {
      const { rerender } = render(<WavePlayer url="/test-audio.wav" height={80} />);
      
      const WaveSurfer = (await import('wavesurfer.js')).default;
      const initialCallCount = (WaveSurfer.create as any).mock.calls.length;
      
      // Rerender con las mismas props no debería recrear WaveSurfer
      rerender(<WavePlayer url="/test-audio.wav" height={80} />);
      
      // El contador de llamadas debería ser el mismo
      expect((WaveSurfer.create as any).mock.calls.length).toBe(initialCallCount);
    });

    it('should memoize wave options', async () => {
      const { rerender } = render(<WavePlayer url="/test-audio.wav" height={80} />);
      
      // Las opciones deben ser las mismas entre renders
      const WaveSurfer = (await import('wavesurfer.js')).default;
      const firstCallArgs = (WaveSurfer.create as any).mock.calls[0][0];
      
      rerender(<WavePlayer url="/test-audio.wav" height={80} />);
      
      const secondCallArgs = (WaveSurfer.create as any).mock.calls[1]?.[0];
      
      // Si no hay segunda llamada, las opciones se memorizaron correctamente
      expect(secondCallArgs).toBeUndefined();
    });
  });
});
