'use server';

import { solveExerciseFromPhoto, type SolveExerciseFromPhotoInput } from '@/ai/flows/solve-exercise-from-photo';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as SolveExerciseFromPhotoInput;
    // The API route now directly calls the server-side flow
    const result = await solveExerciseFromPhoto(body);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
