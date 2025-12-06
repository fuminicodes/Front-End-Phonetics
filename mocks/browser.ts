import { setupWorker } from 'msw/browser';
import { phonemeAnalysisHandlers } from './handlers/phoneme-analysis.handlers';
import { authHandlers } from './handlers/auth.handlers';

// Combine all handlers
const handlers = [...phonemeAnalysisHandlers, ...authHandlers];

export const worker = setupWorker(...handlers);