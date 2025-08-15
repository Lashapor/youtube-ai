"use client";

import { useState } from "react";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState<"url" | "question" | "chat">("url");
  const [showTranscript, setShowTranscript] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  async function handleUrlSubmit() {
    if (!url.trim()) return;
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
      setStep("question");
    } catch (e: unknown) {
      const error = e as Error;
      setErr(error.message || "Failed to get transcript");
    } finally {
      setLoading(false);
    }
  }

  async function handleAskQuestion() {
    if (!transcript || !question.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: question.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setStep("chat");
    setChatLoading(true);
    setErr("");
    const currentQuestion = question.trim();
    setQuestion("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          question: currentQuestion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unknown error");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (e: unknown) {
      const error = e as Error;
      setErr(error.message || "Failed to get answer");
    } finally {
      setChatLoading(false);
    }
  }

  function handleNewUrl() {
    setUrl("");
    setTranscript("");
    setQuestion("");
    setMessages([]);
    setStep("url");
    setErr("");
    setShowTranscript(false);
  }

  function copyTranscript() {
    navigator.clipboard.writeText(transcript);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  function copyMessage(content: string, messageId: string) {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleNewUrl}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNewUrl()}
            aria-label="Go to main page"
          >
            YouTube AI
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Ask AI anything about any <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline transition-colors"
              aria-label="Visit YouTube"
            >
              YouTube
            </a> video
          </p>
        </header>

        {err && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400" role="alert">
              {err}
            </p>
          </div>
        )}

        {step === "url" && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Enter YouTube URL
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Paste the URL of the YouTube video you want to analyze
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  id="youtube-url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="YouTube URL input"
                  disabled={loading}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={loading || !url.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
                  aria-label="Process YouTube URL"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "question" && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-2xl space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Ask Your Question
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  What would you like to know about this video?
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  id="question-input"
                  type="text"
                  placeholder="What is this video about?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Question about the video"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={chatLoading || !question.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
                  aria-label="Ask question"
                >
                  {chatLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking...
                    </div>
                  ) : (
                    "Answer Me"
                  )}
                </button>
              </div>

              <button
                onClick={handleNewUrl}
                className="w-full py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded"
                aria-label="Start over with new URL"
              >
                ← Start over with new URL
              </button>
            </div>
          </div>
        )}

        {step === "chat" && (
          <div className="fixed inset-0 top-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <header className="text-center py-4 border-b border-slate-200 dark:border-slate-700">
              <h1
                className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={handleNewUrl}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNewUrl()}
                aria-label="Go to main page"
              >
                YouTube AI
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Ask AI anything about any <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline transition-colors"
                  aria-label="Visit YouTube"
                >
                  YouTube
                </a> video
              </p>
            </header>
            <div className="h-full grid grid-cols-1 lg:grid-cols-5" style={{ height: 'calc(100vh - 120px)' }}>
              <div className="lg:col-span-1 p-4 space-y-4 border-r border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleNewUrl}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  aria-label="Start with new URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  New URL
                </button>

                <button
                  onClick={() => setShowTranscript(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  aria-label="View transcript"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Transcript
                </button>
              </div>

              <div className="lg:col-span-4 p-4 flex flex-col h-full">
                <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm flex flex-col h-full">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                      Conversation
                    </h3>
                  </div>

                  <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-slate-100 dark:bg-slate-700"}`}>
                            {message.type === "user" ? (
                              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <img
                                src="/ai-icon.svg"
                                alt="AI"
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 group relative ${message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"}`}>
                            <p className="text-sm whitespace-pre-wrap pr-8">
                              {message.content}
                            </p>
                            {copiedMessageId === message.id && (
                              <span className="absolute top-2 right-8 text-green-600 dark:text-green-400 text-xs font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">
                                Copied!
                              </span>
                            )}
                            <button
                              onClick={() => copyMessage(message.content, message.id)}
                              className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${message.type === "user" ? "hover:bg-blue-700 text-blue-100" : "hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400"}`}
                              aria-label="Copy message"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-3 max-w-xs lg:max-w-md">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <img
                              src="/ai-icon.svg"
                              alt="AI"
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="rounded-lg p-3 bg-slate-100 dark:bg-slate-700">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Ask a follow-up question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Follow-up question"
                        disabled={chatLoading}
                      />
                      <button
                        onClick={handleAskQuestion}
                        disabled={chatLoading || !question.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
                        aria-label="Send question"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTranscript && (
          <div
            className="fixed inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowTranscript(false)}
          >
            <div
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Video Transcript
                </h3>
                <div className="flex gap-2 items-center">
                  {copySuccess && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Copied!
                    </span>
                  )}
                  <button
                    onClick={copyTranscript}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    aria-label="Copy transcript to clipboard"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setShowTranscript(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded"
                    aria-label="Close transcript"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {transcript}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
