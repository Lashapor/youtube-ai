import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { transcript, question } = await req.json();
    
    if (!transcript || !question) {
      return NextResponse.json({ error: "Missing transcript or question" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions based on YouTube video transcripts. Only use information from the provided transcript to answer questions."
        },
        {
          role: "user",
          content: `Based on this YouTube transcript: "${transcript}"

Question: ${question}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || "No answer generated";
    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to get answer from AI." },
      { status: 500 }
    );
  }
}