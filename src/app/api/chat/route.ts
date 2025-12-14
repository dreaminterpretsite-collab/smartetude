import { NextRequest, NextResponse } from 'next/server';
import {
  getSupportChatResponse,
  GetSupportChatResponseInputSchema,
} from '@/ai/flows/get-support-chat-response';
import { z } from 'genkit';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Validation du body
    const input = GetSupportChatResponseInputSchema.parse(json);

    const response = await getSupportChatResponse(input);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API chat error:', error);
    return NextResponse.json(
      { response: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 },
    );
  }
}
