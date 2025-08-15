import { Message } from "../types";

type ChatMessageProps = {
  message: Message;
  onCopy: (content: string, messageId: string) => void;
  copiedMessageId: string | null;
};

export default function ChatMessage({ message, onCopy, copiedMessageId }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-slate-100 dark:bg-slate-700"}`}>
          {message.type === "user" ? (
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
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
            onClick={() => onCopy(message.content, message.id)}
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
  );
}