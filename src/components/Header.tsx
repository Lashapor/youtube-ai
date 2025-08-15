type HeaderProps = {
  onNewUrl?: () => void;
  showNewUrl?: boolean;
};

export default function Header({ onNewUrl, showNewUrl = true }: HeaderProps) {
  return (
    <header className="text-center py-4">
      <h1
        className={`text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 ${
          showNewUrl ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" : ""
        } transition-colors`}
        onClick={showNewUrl ? onNewUrl : undefined}
        role={showNewUrl ? "button" : undefined}
        tabIndex={showNewUrl ? 0 : undefined}
        onKeyDown={showNewUrl ? (e) => (e.key === "Enter" || e.key === " ") && onNewUrl?.() : undefined}
        aria-label={showNewUrl ? "Go to main page" : undefined}
      >
        YouTube AI
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        Ask AI anything about any{" "}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline transition-colors"
          aria-label="Visit YouTube"
        >
          YouTube
        </a>{" "}
        video
      </p>
    </header>
  );
}