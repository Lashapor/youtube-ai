export default function ChatLoadingIndicator() {
  return (
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
  );
}