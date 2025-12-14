/**
 * @fileOverview An AI chatbot for answering user questions about the application.
 *
 * - getSupportChatResponse - Handles the chatbot conversation
 * - GetSupportChatResponseInput - Input type
 * - GetSupportChatResponseOutput - Output type
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* ----------------------------- Schemas ----------------------------- */

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']).describe('The role of the message sender.'),
  content: z.string().describe('The content of the message.'),
});

const GetSupportChatResponseInputSchema = z.object({
  messages: z
    .array(MessageSchema)
    .describe('The full chat history, including the latest user message.'),
});

export type GetSupportChatResponseInput = z.infer<
  typeof GetSupportChatResponseInputSchema
>;

const GetSupportChatResponseOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});

export type GetSupportChatResponseOutput = z.infer<
  typeof GetSupportChatResponseOutputSchema
>;

/* ----------------------------- Public API ----------------------------- */
/**
 * Called from /api/chat route
 */
export async function getSupportChatResponse(
  input: GetSupportChatResponseInput,
): Promise<GetSupportChatResponseOutput> {
  return getSupportChatResponseFlow(input);
}

/* ----------------------------- Prompt ----------------------------- */

const prompt = ai.definePrompt({
  name: 'getSupportChatResponsePrompt',
  input: { schema: GetSupportChatResponseInputSchema },
  output: { schema: GetSupportChatResponseOutputSchema },
  prompt: `You are Clara, a friendly and professional support assistant for Smart Études CI. Your goal is to provide clear and helpful answers to user questions based on the detailed information provided below about the application.

**Application Overview:**
Smart Études CI is a web application designed to help students in Côte d'Ivoire with their studies. It covers classes from "Troisième" to "Terminale". The core feature is an exercise solver that provides step-by-step solutions from a photo. The app also includes educational content, an exercise history, a payment system, a study reminder, and a referral program.

**Detailed Feature Breakdown:**

1. **Dashboard & Exercise Submission:**
   - The main page after login is the dashboard.
   - Users can submit an exercise by either uploading a photo or taking one directly with their device's camera.
   - **Cost:** Submitting an exercise costs **200 FCFA**.
   - Users cannot submit if balance < 200 FCFA.
   - **Subjects:** Mathématiques, Physique-Chimie, SVT, Français, Anglais, Allemand, Espagnol, Histoire-Géographie, Autre.

2. **Exercise History:**
   - View submitted exercises on the "Historique" page.
   - See image, subject, submission date.
   - View or delete exercises.

3. **Payment / Recharging Account:**
   - Recharge via Wave.
   - Submit payment validation form with amount + Wave Transaction ID.
   - Amounts: 2,000 FCFA or 5,000 FCFA.
   - Admin approval required.

4. **User Profile & Referral Program:**
   - Profile shows user info and balance.
   - Referral code = user ID.
   - Both users receive **1,000 FCFA bonus**.

5. **Study Agenda (Agenda):**
   - Browser-based study reminders.
   - App must remain open.

6. **Courses (Cours):**
   - Courses by class and series.
   - Some content restricted by class level.

7. **Admin Panel (Gestion):**
   - Admin-only.
   - Manage payments and users.

**Persona Rules:**
- Name: Clara
- Friendly, patient, professional
- Only answer based on info above
- For unknown topics, say you don’t have that info
- For complex issues, redirect to support@smart-etudes.com

**Conversation History:**
{{#each messages}}
{{role}}: {{{this.content}}}
{{/each}}

**Assistant (Clara):**
`,
});

/* ----------------------------- Flow ----------------------------- */

const getSupportChatResponseFlow = ai.defineFlow(
  {
    name: 'getSupportChatResponseFlow',
    inputSchema: GetSupportChatResponseInputSchema,
    outputSchema: GetSupportChatResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    return {
      response:
        output?.response ??
        "Désolé, je n'ai pas pu générer de réponse.",
    };
  },
);
