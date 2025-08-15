import { Message } from "../types";
import Header from "./Header";
import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatLoadingIndicator from "./ChatLoadingIndicator";
import ChatInput from "./ChatInput";

type ChatInterfaceProps = {
  messages: Message[];
  question: string;
  chatLoading: boolean;
  copiedMessageId: string | null;
  onNewUrl: () => void;
  onShowTranscript: () => void;
  onQuestionChange: (question: string) => void;
  onAskQuestion: () => void;
  onCopyMessage: (content: string, messageId: string) => void;
};

export default function ChatInterface({
  messages,
  question,
  chatLoading,
  copiedMessageId,
  onNewUrl,
  onShowTranscript,
  onQuestionChange,
  onAskQuestion,
  onCopyMessage,
}: ChatInterfaceProps) {
  return (
    <div className="fixed inset-0 top-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="border-b border-slate-200 dark:border-slate-700">
        <Header onNewUrl={onNewUrl} showNewUrl={true} />
      </div>
      <div className="h-full grid grid-cols-1 lg:grid-cols-5" style={{ height: 'calc(100vh - 120px)' }}>
        <ChatSidebar onNewUrl={onNewUrl} onShowTranscript={onShowTranscript} />

        <div className="lg:col-span-4 p-4 flex flex-col h-full">
          <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Conversation
              </h3>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={onCopyMessage}
                  copiedMessageId={copiedMessageId}
                />
              ))}

              {chatLoading && <ChatLoadingIndicator />}
            </div>

            <ChatInput
              question={question}
              loading={chatLoading}
              onQuestionChange={onQuestionChange}
              onSubmit={onAskQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}