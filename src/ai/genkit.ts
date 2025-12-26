/**
 * @fileOverview Genkit initialization
 * IMPORTANT: This is server-only code but NOT a Next.js Server Action.
 * Do NOT add "use server" in this file.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize the plugin conditionally.
// If the API key is present, pass it in the config.
// If not (e.g., during build on Render without the env var),
// initialize the plugin without arguments. It will then look for the
// environment variable at runtime when an actual API call is made.
const googleAIPlugin = process.env.GEMINI_API_KEY
  ? googleAI({ apiKey: process.env.GEMINI_API_KEY })
  : googleAI();

export const ai = genkit({
  plugins: [googleAIPlugin],
  model: 'googleai/gemini-2.5-flash',
});
