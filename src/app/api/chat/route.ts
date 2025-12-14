// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupportChatResponse, GetSupportChatResponseInputSchema } from '@/ai/flows/get-support-chat-response';

/**
 * API Route for Smart Études CI support chat
 * Only server-side, must be async
 */
export const POST = async (req: NextRequest) => {
  try {
    // Parse and validate the request body
    const body = await req.json();

    const parsed = GetSupportChatResponseInputSchema.parse(body);

    // Run the chat response flow
    const response = await getSupportChatResponse(parsed);

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error('[API CHAT ERROR]', err);

    // Handle validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: err.errors },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
