'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The check for GEMINI_API_KEY has been removed.
// Genkit itself will handle the case where the API key is missing at runtime
// when an actual AI call is made. This prevents the build from failing.
// A warning is still recommended if the key is missing during development,
// but it is handled elsewhere or assumed to be set for production builds.

export const ai = genkit({
  plugins: [
    googleAI({
      // Pass the API key directly. If it's undefined, provide a fallback to prevent build failure.
      apiKey: process.env.GEMINI_API_KEY || '',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
