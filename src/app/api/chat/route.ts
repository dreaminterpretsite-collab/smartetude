'use server';

import { getSupportChatResponse, type GetSupportChatResponseInput } from '@/ai/flows/get-support-chat-response';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as GetSupportChatResponseInput;
    // The API route now directly calls the server-side flow
    const result = await getSupportChatResponse(body);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
