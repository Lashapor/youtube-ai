"use client";

import { useState } from "react";
import { Message, Step } from "../types";
import Header from "@/components/Header";
import ErrorMessage from "../components/ErrorMessage";
import URLStep from "@/components/URLStep";
import QuestionStep from "@/components/QuestionStep";
import ChatInterface from "@/components/ChatInterface";
import TranscriptModal from "@/components/TranscriptModal";

export default function Home() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState<Step>("url");
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

  if (step === "chat") {
    return (
      <>
        <ChatInterface
          messages={messages}
          question={question}
          chatLoading={chatLoading}
          copiedMessageId={copiedMessageId}
          onNewUrl={handleNewUrl}
          onShowTranscript={() => setShowTranscript(true)}
          onQuestionChange={setQuestion}
          onAskQuestion={handleAskQuestion}
          onCopyMessage={copyMessage}
        />
        {showTranscript && (
          <TranscriptModal
            transcript={transcript}
            copySuccess={copySuccess}
            onClose={() => setShowTranscript(false)}
            onCopy={copyTranscript}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Header onNewUrl={handleNewUrl} showNewUrl={step !== "url"} />
        </div>

        <ErrorMessage message={err} />

        {step === "url" && (
          <URLStep
            url={url}
            loading={loading}
            onUrlChange={setUrl}
            onSubmit={handleUrlSubmit}
          />
        )}

        {step === "question" && (
          <QuestionStep
            question={question}
            loading={chatLoading}
            onQuestionChange={setQuestion}
            onSubmit={handleAskQuestion}
            onNewUrl={handleNewUrl}
          />
        )}
      </div>
    </div>
  );
}
