import { NextResponse } from "next/server";
import { Supadata, Transcript } from "@supadata/js";

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY || "",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
    }

    const transcript: Transcript = await supadata.youtube.transcript({
      url: url,
      lang: "en",
    });

    const text = Array.isArray(transcript.content)
      ? transcript.content.map((item: any) => item.text).join(" ")
      : transcript.content;
    return NextResponse.json({ transcript: text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch transcript." },
      { status: 500 }
    );
  }
}
