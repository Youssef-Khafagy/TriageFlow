import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    // Format history to ensure it matches Gemini's expectations (role: 'user' or 'model')
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts
    }));

    const chat = geminiModel.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    return NextResponse.json({ error: "Assistant unavailable" }, { status: 500 });
  }
}