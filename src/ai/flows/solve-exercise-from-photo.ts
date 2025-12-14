'use server';

/**
 * @fileOverview Genkit flow to solve exercises from a photo
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* ----------------------------- Schemas ----------------------------- */

const SolveExerciseFromPhotoInputSchema = z.object({
  photoDataUri: z.string().describe(
    "Exercise photo as a Base64 data URI: data:<mime>;base64,<data>",
  ),
  subject: z.string().describe('Exercise subject'),
});

export type SolveExerciseFromPhotoInput = z.infer<
  typeof SolveExerciseFromPhotoInputSchema
>;

const SolveExerciseFromPhotoOutputSchema = z.object({
  solution: z.string().describe(
    'Detailed step-by-step solution for the exercise',
  ),
});

export type SolveExerciseFromPhotoOutput = z.infer<
  typeof SolveExerciseFromPhotoOutputSchema
>;

/* ----------------------------- Prompt ----------------------------- */

const solveExerciseFromPhotoPrompt = ai.definePrompt({
  name: 'solveExerciseFromPhotoPrompt',
  input: { schema: SolveExerciseFromPhotoInputSchema },
  output: { schema: SolveExerciseFromPhotoOutputSchema },
  prompt: `
You are an expert tutor for students in Côte d'Ivoire.

RULES:
1. Default language: French
2. If subject is Anglais, Allemand, or Espagnol:
   - Solve in that language
   - Then add: --- EXPLICATION EN FRANÇAIS ---
   - Provide a French explanation summary
3. Be clear, pedagogical, and step-by-step

Subject: {{{subject}}}
Exercise Image:
{{media url=photoDataUri}}
`,
});

/* ----------------------------- Flow ----------------------------- */

const solveExerciseFromPhotoFlow = ai.defineFlow(
  {
    name: 'solveExerciseFromPhotoFlow',
    inputSchema: SolveExerciseFromPhotoInputSchema,
    outputSchema: SolveExerciseFromPhotoOutputSchema,
  },
  async (input) => {
    const { output } = await solveExerciseFromPhotoPrompt(input);

    return (
      output ?? {
        solution:
          "Désolé, je n'ai pas pu générer une solution pour cet exercice.",
      }
    );
  },
);

/* ----------------------------- Public API ----------------------------- */
/**
 * IMPORTANT:
 * - This function is SERVER-ONLY
 * - It must ONLY be called from an API route
 * - NEVER import this in a client component
 */
export async function solveExerciseFromPhoto(
  input: SolveExerciseFromPhotoInput,
): Promise<SolveExerciseFromPhotoOutput> {
  return solveExerciseFromPhotoFlow(input);
}
