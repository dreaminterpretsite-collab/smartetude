/**
 * @fileOverview AI chatbot for Smart Études CI support
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* ----------------------------- Schemas ----------------------------- */

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const GetSupportChatResponseInputSchema = z.object({
  messages: z.array(MessageSchema),
});

export type GetSupportChatResponseInput = z.infer<
  typeof GetSupportChatResponseInputSchema
>;

export const GetSupportChatResponseOutputSchema = z.object({
  response: z.string(),
});

export type GetSupportChatResponseOutput = z.infer<
  typeof GetSupportChatResponseOutputSchema
>;

/* ----------------------------- Prompt ----------------------------- */

const prompt = ai.definePrompt({
  name: 'getSupportChatResponsePrompt',
  input: { schema: GetSupportChatResponseInputSchema },
  output: { schema: GetSupportChatResponseOutputSchema },
  prompt: `
You are Clara, a friendly and professional support assistant for Smart Études CI.

RULES:
- Answer ONLY using the information below
- Be friendly, patient and professional
- If the question is outside scope, say you don't have the info
- For complex issues, redirect to support@smart-etudes.com

APPLICATION INFO:
Smart Études CI helps students from Troisième to Terminale.

- Exercise solving from photo (200 FCFA)
- Exercise history
- Payments via Wave (manual admin validation)
- Referral bonus: 1,000 FCFA each
- Study reminders (browser-based)
- Courses by class & series
- Admin panel for payments & users

Conversation:
{{#each messages}}
{{role}}: {{{this.content}}}
{{/each}}

Assistant (Clara):
`,
});

/* ----------------------------- Flow ----------------------------- */

export const getSupportChatResponseFlow = ai.defineFlow(
  {
    name: 'getSupportChatResponseFlow',
    inputSchema: GetSupportChatResponseInputSchema,
    outputSchema: GetSupportChatResponseOutputSchema,
  },
  async (input) => {
    const result = await prompt.run(input);

    return {
      response: result.response ?? "Désolé, je n'ai pas pu générer de réponse.",
    };
  },
);

/* ----------------------------- Public API ----------------------------- */

export async function getSupportChatResponse(
  input: GetSupportChatResponseInput,
): Promise<GetSupportChatResponseOutput> {
  return getSupportChatResponseFlow(input);
}
