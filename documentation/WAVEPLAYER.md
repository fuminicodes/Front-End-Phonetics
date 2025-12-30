# WavePlayer - Componente de Reproducción de Audio

## 📋 Información del Documento

- **Componente**: WavePlayer & useWaveSurfer Hook
- **Última actualización**: Diciembre 29, 2025
- **Versión**: 1.0.0
- **Estado**: ✅ Producción Ready
- **Tests**: 62/62 pasando (100%)

---

## 🎯 Resumen

**WavePlayer** es un componente de reproducción de audio con visualización de forma de onda, construido sobre [WaveSurfer.js](https://wavesurfer.xyz/). Está completamente integrado con el **Nebula Glass Design System** y cumple con los estándares **WCAG 2.1 Level AA** de accesibilidad.

### Características Principales

- 🎨 **Visualización de Onda**: Renderizado interactivo de la forma de onda del audio
- ▶️ **Controles Completos**: Play/Pause con interfaz táctil y teclado
- ⏱️ **Display de Tiempo**: Visualización en tiempo real del progreso (current/duration)
- ♿ **Accesible**: Navegación por teclado, ARIA labels, contraste WCAG AA
- 🎭 **Glassmorphism**: Diseño coherente con Nebula Glass
- 🔄 **Manejo de Errores**: Recuperación graceful de errores de carga
- 📱 **Responsive**: Adaptable a cualquier tamaño de pantalla

---

## 🏗️ Arquitectura

### Estructura de Capas

```
┌─────────────────────────────────────────────────────────┐
│                  WavePlayer Component                    │
│  • UI/UX Logic                                          │
│  • Glassmorphism Design                                 │
│  • Accessibility (ARIA, Keyboard)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ usa
                     ▼
┌─────────────────────────────────────────────────────────┐
│              useWaveSurfer Hook                          │
│  • State Management (playing, ready, time)              │
│  • Lifecycle Management                                  │
│  • Error Handling                                        │
│  • Event Coordination                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ controla
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 WaveSurfer.js Library                    │
│  • Audio Decoding                                        │
│  • Waveform Rendering (Canvas)                          │
│  • Playback Control                                      │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```typescript
// 1. Inicialización
<WavePlayer url="/audio.mp3" />
  ↓
useWaveSurfer({ containerRef, url, options })
  ↓
WaveSurfer.create({ container, waveColor, ... })
  ↓
wavesurfer.load(url)

// 2. Eventos WaveSurfer → Estado React
wavesurfer.on('ready')  → setIsReady(true), setDuration()
wavesurfer.on('play')   → setIsPlaying(true)
wavesurfer.on('pause')  → setIsPlaying(false)
wavesurfer.on('timeupdate') → setCurrentTime()

// 3. User Actions → WaveSurfer
<Button onClick={togglePlay} />
  ↓
wavesurferRef.current.playPause()
  ↓
Dispara eventos 'play' o 'pause'
```

---

## 📦 Instalación y Setup

### Dependencias Requeridas

```json
{
  "dependencies": {
    "wavesurfer.js": "^7.0.0",
    "react": "^18.0.0",
    "lucide-react": "^0.263.1"
  }
}
```

### Instalación

```bash
npm install wavesurfer.js
# o
yarn add wavesurfer.js
```

### Ubicación en el Proyecto

```
src/
├── shared/
│   ├── hooks/
│   │   └── use-wavesurfer.ts      # Hook principal
│   └── ui/
│       └── audio/
│           └── wave-player.tsx     # Componente UI
```

---

## 🚀 Uso Básico

### Ejemplo Simple

```tsx
import { WavePlayer } from '@/shared/ui/audio/wave-player';

export default function AudioDemo() {
  return (
    <div className="p-4">
      <WavePlayer url="/audio/sample.mp3" />
    </div>
  );
}
```

### Con Personalización

```tsx
<WavePlayer 
  url="/audio/recording.wav"
  className="max-w-2xl mx-auto"
  height={120}
/>
```

### Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `url` | `string` | *requerido* | URL del archivo de audio (mp3, wav, ogg, etc.) |
| `className` | `string` | `''` | Clases CSS adicionales para el contenedor |
| `height` | `number` | `80` | Altura del canvas de la forma de onda en píxeles |

---

## 🎨 Integración con Design System

### Clases Nebula Glass Utilizadas

```tsx
// Contenedor principal con efecto glass
<div className="glass-panel p-4">
  
  // Canvas con fondo semi-transparente
  <div className="bg-black/5 dark:bg-white/5">
    
  // Display de tiempo con efecto glass
  <div className="glass-input px-4 py-1">
    <span className="text-primary-500 font-bold">1:23</span>
    <span className="glass-text">3:45</span>
  </div>
</div>
```

### Colores de la Forma de Onda

```typescript
{
  waveColor: 'rgba(152, 88, 202, 0.4)',  // accent-secondary (púrpura)
  progressColor: '#007cff',               // primary-500 (azul eléctrico)
  cursorColor: '#cca5eb',                 // accent-tertiary
}
```

### Personalización de Estilos

```tsx
// Cambiar altura de la onda
<WavePlayer url="/audio.mp3" height={150} />

// Agregar clases personalizadas
<WavePlayer 
  url="/audio.mp3"
  className="shadow-2xl border border-primary-500/20"
/>

// En globals.css o módulo específico
.custom-wave-player .glass-panel {
  background: linear-gradient(135deg, rgba(63, 35, 120, 0.1) 0%, rgba(152, 88, 202, 0.05) 100%);
}
```

---

## 🔧 useWaveSurfer Hook

### Interfaz del Hook

```typescript
interface UseWaveSurferProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  url?: string;
  options?: Omit<WaveSurferOptions, 'container'>;
}

interface UseWaveSurferReturn {
  wavesurfer: WaveSurfer | null;
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  togglePlay: () => void;
  seekTo: (progress: number) => void;
}
```

### Uso Avanzado del Hook

```tsx
'use client';

import { useRef, useMemo } from 'react';
import { useWaveSurfer } from '@/shared/hooks/use-wavesurfer';

export function CustomAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const options = useMemo(() => ({
    waveColor: '#4a90e2',
    progressColor: '#007cff',
    height: 100,
    barWidth: 3,
    barGap: 2,
  }), []);

  const { 
    isPlaying, 
    isReady, 
    currentTime, 
    duration,
    error,
    togglePlay,
    seekTo 
  } = useWaveSurfer({
    containerRef,
    url: audioUrl,
    options
  });

  return (
    <div>
      {/* Visualización */}
      <div ref={containerRef} />
      
      {/* Controles personalizados */}
      <button onClick={togglePlay} disabled={!isReady}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      {/* Barra de progreso personalizada */}
      <input 
        type="range" 
        min={0} 
        max={1} 
        step={0.01}
        value={duration ? currentTime / duration : 0}
        onChange={(e) => seekTo(parseFloat(e.target.value))}
      />
      
      {/* Manejo de errores */}
      {error && <p className="text-danger-500">{error}</p>}
    </div>
  );
}
```

### Opciones de WaveSurfer Disponibles

```typescript
const customOptions = {
  // Apariencia de la onda
  waveColor: '#9858ca',
  progressColor: '#007cff',
  cursorColor: '#cca5eb',
  
  // Forma de las barras
  barWidth: 2,
  barGap: 3,
  barRadius: 3,
  barHeight: 1,
  
  // Dimensiones
  height: 80,
  
  // Características
  normalize: true,      // Normaliza amplitud
  interact: true,       // Permite hacer click para buscar
  hideScrollbar: false,
  autoCenter: true,
  
  // Performance
  backend: 'WebAudio',  // o 'MediaElement'
  
  // Visualización adicional
  splitChannels: false, // Canales estéreo separados
  fillParent: true,
};
```

---

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1 Level AA

| Criterio | Level | Estado | Implementación |
|----------|-------|--------|----------------|
| 2.1.1 Keyboard | A | ✅ | Botón navegable con Tab, activable con Enter/Space |
| 2.4.7 Focus Visible | AA | ✅ | Outline visible en botón al recibir focus |
| 4.1.2 Name, Role, Value | A | ✅ | `aria-label` dinámico en botón |
| 1.4.3 Contrast | AA | ✅ | Contraste mínimo 4.5:1 en todos los textos |

### Características de Accesibilidad

```tsx
// 1. ARIA Labels dinámicos
<Button 
  aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
>

// 2. Estados deshabilitados
<Button disabled={!isReady}>

// 3. Indicadores visuales de estado
{!isReady && <Loader2 className="animate-spin" />}

// 4. Texto semántico
<span className="sr-only">Tiempo actual:</span>
<span>{formatTime(currentTime)}</span>
```

### Navegación por Teclado

| Tecla | Acción |
|-------|--------|
| `Tab` | Navegar al botón Play/Pause |
| `Enter` / `Space` | Toggle reproducción |
| `Shift + Tab` | Navegar hacia atrás |

### Soporte para Lectores de Pantalla

```
"Reproducir audio, botón"
[usuario presiona Enter]
"Pausar audio, botón"
"Tiempo actual: 1 minuto 23 segundos de 3 minutos 45 segundos"
```

---

## 🛡️ Manejo de Errores

### Tipos de Errores Manejados

#### 1. Error de Carga de Audio

```typescript
// El hook maneja errores de fetch/decodificación
ws.load(url).catch((err) => {
  if (err.name === 'AbortError') return; // Ignorar cleanup
  setError(`No se pudo cargar el audio: ${err.message}`);
});
```

**Visualización en UI:**
```tsx
{error && (
  <div className="glass-panel border-danger-500 bg-danger-500/10">
    <p className="text-danger-500">{error}</p>
  </div>
)}
```

#### 2. Errores Internos de WaveSurfer

```typescript
ws.on('error', (err) => {
  const errorMessage = typeof err === 'string' 
    ? err 
    : (err?.message || 'Error al cargar audio');
  setError(errorMessage);
});
```

#### 3. Errores de Cleanup

```typescript
// Cleanup seguro que no lanza errores
try {
  ws.unAll();
  ws.destroy();
} catch (e) {
  console.debug('Error durante cleanup (ignorable):', e);
}
```

### Recuperación de Errores

```tsx
function AudioPlayerWithRetry({ url }: { url: string }) {
  const [audioUrl, setAudioUrl] = useState(url);
  
  const { error } = useWaveSurfer({ 
    containerRef, 
    url: audioUrl 
  });

  const handleRetry = () => {
    // Forzar recarga con timestamp
    setAudioUrl(`${url}?t=${Date.now()}`);
  };

  return (
    <div>
      <WavePlayer url={audioUrl} />
      {error && (
        <Button onClick={handleRetry}>
          Reintentar carga
        </Button>
      )}
    </div>
  );
}
```

---

## 🔄 Ciclo de Vida del Componente

### Secuencia de Inicialización

```
1. Montaje del Componente
   ↓
2. containerRef disponible
   ↓
3. WaveSurfer.create()
   ↓
4. Registrar event listeners
   ↓
5. wavesurfer.load(url)
   ↓
6. Evento 'ready' → isReady: true
   ↓
7. Componente listo para interacción
```

### Actualización de URL

```typescript
// Cuando cambia la URL, se recrea la instancia
useEffect(() => {
  // ... crear instancia
  
  if (url) {
    ws.load(url);
  }
  
  return () => ws.destroy();
}, [containerRef, options, url]); // ← url en dependencias
```

### Desmontaje y Cleanup

```
1. Usuario navega/cierra componente
   ↓
2. useEffect cleanup se ejecuta
   ↓
3. ws.unAll() - Remover listeners
   ↓
4. ws.destroy() - Liberar recursos
   ↓
5. wavesurferRef.current = null
   ↓
6. Canvas y AudioContext eliminados
```

---

## 📊 Performance

### Optimizaciones Implementadas

#### 1. useMemo para Opciones

```typescript
const waveOptions = useMemo(() => ({
  waveColor: 'rgba(152, 88, 202, 0.4)',
  progressColor: '#007cff',
  // ...
}), [height]); // Solo recalcular si cambia height
```

**Beneficio**: Evita recrear objeto en cada render, lo que previene reinstanciaciones innecesarias de WaveSurfer.

#### 2. useCallback para Funciones

```typescript
const togglePlay = useCallback(() => {
  wavesurferRef.current?.playPause();
}, []); // Función estable entre renders
```

**Beneficio**: Previene recreación de funciones que causan re-renders en componentes hijos.

#### 3. Refs para Instancia

```typescript
const wavesurferRef = useRef<WaveSurfer | null>(null);
```

**Beneficio**: La instancia de WaveSurfer persiste entre renders sin causar re-renders.

### Métricas de Performance

| Métrica | Valor | Notas |
|---------|-------|-------|
| **Tiempo de Montaje** | ~50-100ms | Incluye creación de canvas |
| **Tiempo de Carga** | Variable | Depende del tamaño del archivo |
| **FPS Durante Reproducción** | 60fps | Canvas optimizado |
| **Memoria** | ~5-15MB | Depende de duración del audio |

### Best Practices de Performance

```tsx
// ✅ CORRECTO: Memoizar opciones
const options = useMemo(() => ({ ... }), []);

// ❌ INCORRECTO: Recrear objeto inline
<WavePlayer 
  options={{ waveColor: '#007cff' }} // Nueva ref cada render
/>

// ✅ CORRECTO: Lazy loading condicional
{showPlayer && <WavePlayer url="/large-audio.mp3" />}

// ❌ INCORRECTO: Cargar siempre
<WavePlayer url="/large-audio.mp3" className={showPlayer ? '' : 'hidden'} />
```

---

## 🧪 Testing

### Coverage Completo

```
✅ WavePlayer Integration Tests:    33/33 pasando
✅ useWaveSurfer Hook Unit Tests:   29/29 pasando
📊 Total:                            62/62 pasando (100%)
```

### Ejecutar Tests

```bash
# Todos los tests de WavePlayer
npm test -- wave-player

# Solo tests del hook
npm test -- use-wavesurfer

# Con coverage
npm run test:coverage -- wave-player

# UI interactiva
npm run test:ui
```

### Tests de Usuario (Manual)

**Checklist de QA:**

- [ ] Carga correctamente archivos MP3
- [ ] Carga correctamente archivos WAV
- [ ] Botón Play cambia a Pause al reproducir
- [ ] Timer se actualiza durante reproducción
- [ ] Click en la onda busca a esa posición
- [ ] Funciona con teclado (Tab + Enter)
- [ ] Muestra spinner mientras carga
- [ ] Maneja archivos inexistentes gracefully
- [ ] Responsive en móviles
- [ ] Soporta tema claro/oscuro

### Tests de Accesibilidad

```bash
# Tests automatizados con jest-axe
npm test -- wave-player.accessibility

# Validación manual con lector de pantalla
# - NVDA (Windows)
# - JAWS (Windows)
# - VoiceOver (macOS)
```

Consulta [WAVEPLAYER_TESTING.md](./WAVEPLAYER_TESTING.md) para documentación completa de testing.

---

## 🎓 Ejemplos Avanzados

### Ejemplo 1: Player con Lista de Reproducción

```tsx
'use client';

import { useState } from 'react';
import { WavePlayer } from '@/shared/ui/audio/wave-player';

const playlist = [
  { id: 1, title: 'Track 1', url: '/audio/track1.mp3' },
  { id: 2, title: 'Track 2', url: '/audio/track2.mp3' },
  { id: 3, title: 'Track 3', url: '/audio/track3.mp3' },
];

export function PlaylistPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);

  return (
    <div className="space-y-4">
      <h2 className="glass-text font-bold">
        {playlist[currentTrack].title}
      </h2>
      
      <WavePlayer 
        url={playlist[currentTrack].url}
        key={playlist[currentTrack].id} // Fuerza recreación
      />
      
      <div className="flex gap-2">
        <Button 
          onClick={() => setCurrentTrack(prev => Math.max(0, prev - 1))}
          disabled={currentTrack === 0}
        >
          Anterior
        </Button>
        <Button 
          onClick={() => setCurrentTrack(prev => Math.min(playlist.length - 1, prev + 1))}
          disabled={currentTrack === playlist.length - 1}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
```

### Ejemplo 2: Player con Regiones/Marcadores

```tsx
import { useWaveSurfer } from '@/shared/hooks/use-wavesurfer';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';

export function RegionPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const options = useMemo(() => ({
    waveColor: '#9858ca',
    progressColor: '#007cff',
    plugins: [
      RegionsPlugin.create({
        regions: [
          {
            start: 10,
            end: 20,
            color: 'rgba(0, 124, 255, 0.3)',
            drag: false,
            resize: false,
          },
        ],
      }),
    ],
  }), []);

  const { wavesurfer } = useWaveSurfer({ containerRef, url, options });

  return <div ref={containerRef} />;
}
```

### Ejemplo 3: Player con Análisis de Espectro

```tsx
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram';

export function SpectrogramPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLDivElement>(null);
  
  const options = useMemo(() => ({
    waveColor: '#9858ca',
    progressColor: '#007cff',
    plugins: spectrogramRef.current ? [
      SpectrogramPlugin.create({
        container: spectrogramRef.current,
        labels: true,
      }),
    ] : [],
  }), []);

  const { togglePlay, isPlaying } = useWaveSurfer({ 
    containerRef, 
    url, 
    options 
  });

  return (
    <div className="glass-panel p-4 space-y-4">
      <div ref={containerRef} />
      <div ref={spectrogramRef} className="h-64" />
      <Button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
}
```

### Ejemplo 4: Control de Velocidad de Reproducción

```tsx
export function VariableSpeedPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const { wavesurfer, togglePlay } = useWaveSurfer({ 
    containerRef, 
    url 
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(playbackRate);
    }
  }, [wavesurfer, playbackRate]);

  return (
    <div className="glass-panel p-4 space-y-4">
      <div ref={containerRef} />
      
      <div className="flex items-center gap-4">
        <Button onClick={togglePlay}>Play/Pause</Button>
        
        <label className="glass-text">
          Velocidad: {playbackRate}x
          <input 
            type="range" 
            min={0.5} 
            max={2} 
            step={0.1}
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="ml-2"
          />
        </label>
      </div>
    </div>
  );
}
```

---

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. La onda no se visualiza

**Síntomas**: El componente renderiza pero no se ve la forma de onda.

**Soluciones**:
```tsx
// ✅ Verificar que containerRef esté asignado
<div ref={containerRef} /> // Debe tener esta ref

// ✅ Verificar que la URL sea válida
console.log('URL:', url);

// ✅ Verificar que el archivo sea accesible
fetch(url).then(r => console.log('Audio accesible:', r.ok));

// ✅ Verificar CORS si es URL externa
// El servidor debe incluir: Access-Control-Allow-Origin: *
```

#### 2. Error: "Cannot read property 'getContext' of null"

**Causa**: Canvas no disponible en SSR de Next.js.

**Solución**:
```tsx
// ✅ Siempre usar 'use client'
'use client';

import { WavePlayer } from '@/shared/ui/audio/wave-player';

export default function Page() {
  return <WavePlayer url="/audio.mp3" />;
}
```

#### 3. El audio no se reproduce en iOS

**Causa**: iOS requiere interacción del usuario para reproducir audio.

**Solución**:
```tsx
// ✅ Asegurar que playPause se llame desde un evento de usuario
<Button onClick={togglePlay}> // ✅ OK
  Play
</Button>

// ❌ NO funciona en iOS
useEffect(() => {
  togglePlay(); // ❌ No iniciado por usuario
}, []);
```

#### 4. Memoria creciente (memory leak)

**Causa**: No se destruye WaveSurfer al desmontar.

**Verificación**:
```typescript
// ✅ El hook ya incluye cleanup
useEffect(() => {
  // ...
  return () => {
    ws.unAll();    // ✅ Limpia listeners
    ws.destroy();  // ✅ Destruye instancia
  };
}, []);
```

#### 5. Advertencias de `act()` en tests

**Causa**: Eventos de WaveSurfer actualizan estado asíncronamente.

**Solución**:
```typescript
// ✅ Usar waitFor de Testing Library
await waitFor(() => {
  expect(screen.queryByRole('button')).not.toBeDisabled();
});
```

---

## 📚 Referencias

### Documentación Relacionada

- [WAVEPLAYER_TESTING.md](./WAVEPLAYER_TESTING.md) - Tests completos del componente
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Nebula Glass Design System
- [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) - Guías de accesibilidad

### Recursos Externos

- [WaveSurfer.js Official Docs](https://wavesurfer.xyz/)
- [WaveSurfer.js Examples](https://wavesurfer.xyz/examples/)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### API de WaveSurfer.js

```typescript
// Métodos principales disponibles en wavesurferRef.current
wavesurfer.play()              // Reproducir
wavesurfer.pause()             // Pausar
wavesurfer.playPause()         // Toggle play/pause
wavesurfer.stop()              // Detener y volver al inicio
wavesurfer.seekTo(progress)    // Buscar (0-1)
wavesurfer.setTime(seconds)    // Ir a segundo específico
wavesurfer.skip(seconds)       // Saltar +/- segundos
wavesurfer.setVolume(volume)   // Volumen (0-1)
wavesurfer.setMute(isMuted)    // Silenciar
wavesurfer.setPlaybackRate(rate) // Velocidad (0.5-2)
wavesurfer.zoom(pixels)        // Zoom (píxeles por segundo)
wavesurfer.getDuration()       // Duración total
wavesurfer.getCurrentTime()    // Tiempo actual
wavesurfer.isPlaying()         // Estado de reproducción
```

---

## 🚧 Roadmap

### Features Planificadas

- [ ] **Control de Volumen**: Slider de volumen integrado
- [ ] **Velocidad de Reproducción**: Control 0.5x - 2x
- [ ] **Loop Mode**: Reproducción en bucle
- [ ] **Regiones**: Soporte para marcar secciones del audio
- [ ] **Descarga**: Botón para descargar el archivo de audio
- [ ] **Compartir**: Integración con Web Share API
- [ ] **Subtítulos/Lyrics**: Sincronización con texto
- [ ] **Análisis de Espectro**: Visualización de frecuencias

### Mejoras Técnicas

- [ ] Lazy loading del componente WaveSurfer
- [ ] Soporte para streaming de audio
- [ ] Cache de waveforms generadas
- [ ] Worker thread para procesamiento pesado
- [ ] Soporte offline con Service Workers

---

## 💡 Best Practices

### ✅ DO

```tsx
// Usar 'use client' directive
'use client';

// Memoizar opciones
const options = useMemo(() => ({ ... }), [dependencies]);

// Proporcionar height explícito
<WavePlayer height={100} />

// Manejar estados de error
{error && <ErrorMessage>{error}</ErrorMessage>}

// Dar aria-labels descriptivos
<Button aria-label="Reproducir grabación de análisis fonético">

// Usar key cuando cambia URL dinámicamente
<WavePlayer key={audioId} url={audioUrl} />
```

### ❌ DON'T

```tsx
// No usar en Server Components sin 'use client'
// ❌ app/page.tsx (sin directive)
export default function Page() {
  return <WavePlayer url="/audio.mp3" />; // ERROR
}

// No recrear opciones en cada render
// ❌
<WavePlayer options={{ waveColor: '#007cff' }} />

// No ignorar errores
// ❌
const { error } = useWaveSurfer(...);
// ... no hacer nada con error

// No cargar audio muy pesado sin aviso
// ❌
<WavePlayer url="/audio-100mb.wav" />

// No destruir wavesurfer manualmente
// ❌
useEffect(() => {
  wavesurfer?.destroy(); // El hook ya lo maneja
}, []);
```

---

## 🤝 Contribución

### Reportar Bugs

Si encuentras un bug, abre un issue con:

1. **Descripción**: Qué esperabas vs qué ocurrió
2. **Reproducción**: Pasos para reproducir el bug
3. **Código**: Snippet mínimo que reproduce el problema
4. **Entorno**: Navegador, OS, versión de Next.js

### Solicitar Features

Para nuevas funcionalidades:

1. Verifica que no exista en el roadmap
2. Describe el caso de uso
3. Proporciona ejemplos de UI/UX
4. Considera implicaciones de accesibilidad

---

**Última actualización**: Diciembre 29, 2025  
**Mantenido por**: Equipo de Front-End  
**Estado**: ✅ Producción Ready  
**Tests**: 62/62 pasando (100%)
