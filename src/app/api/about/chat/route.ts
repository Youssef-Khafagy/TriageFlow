import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // FIX: Filter history to ensure it STARTS with a 'user' role
    // We find the index of the first 'user' message and slice from there
    const firstUserIndex = (history || []).findIndex((msg: any) => msg.role === 'user');
    const validHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const formattedHistory = validHistory.map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts
    }));

    const chat = geminiModel.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    return NextResponse.json({ error: "Assistant unavailable" }, { status: 500 });
  }
}