
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    '\n***************************************************\n' +
    'WARNING: GEMINI_API_KEY is not defined.\n' +
    'The application will build, but AI features will fail at runtime.\n' +
    'Please add GEMINI_API_KEY to your environment variables.\n' +
    '***************************************************\n'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      // Pass the API key directly. If it's undefined, Genkit will handle the error at runtime.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
