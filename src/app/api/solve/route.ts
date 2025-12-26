import { NextResponse } from 'next/server';
import { solveExerciseFromPhoto } from '@/ai/flows/solve-exercise-from-photo';

/**
 * POST /api/solve
 * Body:
 * {
 *   photoDataUri: string;
 *   subject: string;
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { photoDataUri, subject } = body;

    if (!photoDataUri || !subject) {
      return NextResponse.json(
        { error: 'photoDataUri et subject sont requis.' },
        { status: 400 },
      );
    }

    const result = await solveExerciseFromPhoto({
      photoDataUri,
      subject,
    });

    if (!result?.solution) {
      return NextResponse.json(
        { error: "Impossible de générer la solution." },
        { status: 500 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ /api/solve error:', error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Une erreur interne est survenue lors du traitement.',
      },
      { status: 500 },
    );
  }
}
