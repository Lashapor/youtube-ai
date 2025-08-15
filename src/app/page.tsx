// app/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFetch() {
    setLoading(true);
    setErr("");
    setTranscript("");

    try {
      const res = await fetch(`/api/transcript?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unknown error");
      }
      setTranscript(data.transcript);
    } catch (e: any) {
      setErr(e.message || "Failed to get transcript");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Youtube script</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          id="youtube-url"
          type="text"
          placeholder="Paste YouTube URL or video ID"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <button
          id="show-transcript"
          onClick={handleFetch}
          disabled={loading || !url.trim()}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Show me transcript"}
        </button>
      </div>

      {err && (
        <p style={{ color: "crimson", marginBottom: 8 }}>
          {err}
        </p>
      )}

      <p id="transcript" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {transcript || "Transcript will appear here"}
      </p>

      {/* Optional: just to keep your original import in use */}
      <div style={{ marginTop: 24, opacity: 0.6 }}>
        <Image
          src="https://dummyimage.com/600x200/efefef/333&text=YouTube+Transcript+Demo"
          alt="placeholder"
          width={600}
          height={200}
        />
      </div>
    </main>
  );
}
