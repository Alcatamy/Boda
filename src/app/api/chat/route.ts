import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { weddingContext } from '@/lib/knowledge-base';

// Check for API Key
const apiKey = process.env.GOOGLE_API_KEY;

export const runtime = 'edge';

export async function POST(req: Request) {
  if (!apiKey) {
    return new Response(
      "El Concierge AI no está activo todavía (Falta GOOGLE_API_KEY). Por favor contacta con los novios.",
      { status: 503 }
    );
  }

  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro-latest'), // Using a capable model
    system: weddingContext,
    messages,
  });

  return result.toTextStreamResponse();
}
