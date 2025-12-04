import { setupWorker } from 'msw/browser';
import { phonemeAnalysisHandlers } from './handlers/phoneme-analysis.handlers';

export const worker = setupWorker(...phonemeAnalysisHandlers);