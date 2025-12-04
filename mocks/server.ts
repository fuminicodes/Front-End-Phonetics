import { setupServer } from 'msw/node';
import { phonemeAnalysisHandlers } from './handlers/phoneme-analysis.handlers';

export const server = setupServer(...phonemeAnalysisHandlers);