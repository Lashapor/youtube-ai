type ChatInputProps = {
  question: string;
  loading: boolean;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
};

export default function ChatInput({ question, loading, onQuestionChange, onSubmit }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ask a follow-up question..."
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Follow-up question"
          disabled={loading}
        />
        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
          aria-label="Send question"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}