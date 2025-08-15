// app/api/transcript/route.ts
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

function extractVideoId(input: string): string | null {
  try {
    // Handle full URLs like https://www.youtube.com/watch?v=VIDEOID
    const url = new URL(input);
    if (url.hostname.includes("youtube.com")) {
      // youtu.be / youtube.com/shorts / youtube.com/watch
      if (url.pathname.startsWith("/watch")) {
        return url.searchParams.get("v");
      }
      if (url.hostname === "youtu.be") {
        return url.pathname.slice(1);
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
    }
    // Handle youtu.be short links directly passed
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }
  } catch {
    // Not a URL, maybe the user pasted the raw video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("url");
    if (!raw) {
      return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
    }

    const videoId = extractVideoId(raw);
    if (!videoId) {
      return NextResponse.json({ error: "Could not parse video ID." }, { status: 400 });
    }

    // Fetch transcript (auto-selects available language; you can pass a lang code)
    const items = await YoutubeTranscript.fetchTranscript(videoId);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No transcript available for this video." }, { status: 404 });
    }

    const text = items.map(i => i.text).join(" ");
    return NextResponse.json({ transcript: text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch transcript." },
      { status: 500 }
    );
  }
}
