import LoadingSpinner from "./LoadingSpinner";
import ConfigButton from "./ConfigButton";

type URLStepProps = {
  url: string;
  loading: boolean;
  hasValidKeys: boolean;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onConfigClick: () => void;
};

export default function URLStep({ url, loading, hasValidKeys, onUrlChange, onSubmit, onConfigClick }: URLStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline transition-colors"
              aria-label="Visit YouTube"
            >
              YouTube
            </a>{" "}
            AI
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Paste the URL of the YouTube video you want to analyze
          </p>
        </div>

        <div className="flex gap-3">
          <ConfigButton onClick={onConfigClick} hasKeys={hasValidKeys} />
          <input
            id="youtube-url"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="YouTube URL input"
            disabled={loading}
          />
          <button
            onClick={onSubmit}
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed"
            aria-label="Process YouTube URL"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                Loading...
              </div>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}