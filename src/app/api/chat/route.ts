import { NextResponse } from 'next/server';
import { getSupportChatResponse } from '@/ai/flows/get-support-chat-response';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.messages) {
      return NextResponse.json(
        { error: 'messages requis' },
        { status: 400 },
      );
    }

    const result = await getSupportChatResponse(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ /api/chat error:', error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Erreur interne lors du traitement du chat.',
      },
      { status: 500 },
    );
  }
}
