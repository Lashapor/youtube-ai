import LoadingSpinner from "./LoadingSpinner";

type QuestionStepProps = {
  question: string;
  loading: boolean;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  onNewUrl: () => void;
};

export default function QuestionStep({ question, loading, onQuestionChange, onSubmit, onNewUrl }: QuestionStepProps) {
  return (
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
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Question about the video"
            disabled={loading}
          />
          <button
            onClick={onSubmit}
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
            aria-label="Ask question"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                Thinking...
              </div>
            ) : (
              "Answer Me"
            )}
          </button>
        </div>

        <button
          onClick={onNewUrl}
          className="w-full py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded"
          aria-label="Start over with new URL"
        >
          ← Start over with new URL
        </button>
      </div>
    </div>
  );
}