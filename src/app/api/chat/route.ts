import { NextResponse } from 'next/server';
import {
  getSupportChatResponse,
  type GetSupportChatResponseInput,
} from '@/ai/flows/get-support-chat-response';

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as GetSupportChatResponseInput;

    const result = await getSupportChatResponse(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /chat]', error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          'Une erreur inattendue est survenue.',
      },
      { status: 500 },
    );
  }
}
