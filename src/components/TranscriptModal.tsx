type TranscriptModalProps = {
  transcript: string;
  copySuccess: boolean;
  onClose: () => void;
  onCopy: () => void;
};

export default function TranscriptModal({ transcript, copySuccess, onClose, onCopy }: TranscriptModalProps) {
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
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
              onClick={onCopy}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              aria-label="Copy transcript to clipboard"
            >
              Copy
            </button>
            <button
              onClick={onClose}
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
  );
}