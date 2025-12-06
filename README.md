# 🎤 Phonetics Analyzer

A Next.js application for recording audio and analyzing phoneme patterns using advanced speech processing technology.

## ⚡ Recent Updates

### ✅ Migration to Server Actions (December 2024)

All API Routes have been migrated to **Server Actions** following Next.js 16 best practices and Clean Architecture patterns.

**New Pages Available:**
- `/proxy-test-sa` - Server Action basic test
- `/comparison-sa` - Standard vs Direct Action comparison
- `/debug-sa` - Debug action with detailed logging

**Documentation:**
- [Migration Guide](./documentation/MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md) - Complete migration documentation
- [Architecture Guide](./documentation/GUIDE_ARCHITECTURE.md) - Project architecture standards

**Deprecated API Routes:**
- ⚠️ `/api/phoneme-analysis` → Use `analyzeAudioAction()`
- ⚠️ `/api/phoneme-analysis-alt` → Use `analyzeAudioDirectAction()`
- ⚠️ `/api/debug-proxy` → Use `analyzeAudioDebugAction()`

## Features

- **Audio Recording**: Browser-based audio recording with high-quality capture
- **Phoneme Analysis**: Real-time V phoneme detection using external API
- **Interactive Interface**: Clean, responsive UI with recording controls
- **Real-time Feedback**: Visual indicators for recording status and analysis results
- **Audio Playback**: Review recordings before analysis

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API for recording
- **API Integration**: REST API communication with phoneme recognition service

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Phoneme Recognition API server running on `http://localhost:5005`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Front-End-Phonetics
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Server

Make sure the phoneme recognition API is running at `http://localhost:5005` with the endpoint:
- `POST /api/PhonemeRecognition/analyze-v` - Audio analysis endpoint

## Usage

1. **Start Recording**: Click the "Start Recording" button to begin audio capture
2. **Speak Clearly**: Speak into your microphone with clear pronunciation
3. **Stop Recording**: Click "Stop Recording" when finished
4. **Review Audio**: Use the audio player to review your recording
5. **Analyze**: Click "Analyze Phoneme" to process the audio
6. **View Results**: Check the analysis results for V phoneme detection

## API Response Format

The application expects the following response from the phoneme analysis API:

```typescript
interface PhonemeAnalysisResponse {
  fileName?: string;
  isVPhoneme: boolean;
  confidence: number;
  duration: number;
  sampleRate: number;
  message?: string;
}
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── AudioRecorder.tsx  # Audio recording component
│   └── AnalysisResults.tsx# Results display component
├── hooks/                 # Custom React hooks
│   └── useAudioRecorder.ts# Audio recording logic
├── services/              # API services
│   └── phonemeAnalysis.ts # API communication
└── types/                 # TypeScript definitions
    └── api.ts             # API type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Browser Requirements

- Modern browser with Web Audio API support
- Microphone permissions required
- HTTPS required for production (microphone access)

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**: Ensure browser permissions allow microphone access
2. **API Connection Failed**: Verify the phoneme recognition server is running on port 5005
3. **Recording Not Working**: Check browser compatibility and HTTPS requirements
4. **Analysis Errors**: Confirm API server endpoints and response format

### Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

This project is licensed under the MIT License.
