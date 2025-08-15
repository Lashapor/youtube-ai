import { useState, useEffect } from "react";

type ConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { supadataKey: string; openaiKey: string }) => void;
  initialKeys: { supadataKey: string; openaiKey: string };
};

export default function ConfigModal({ isOpen, onClose, onSave, initialKeys }: ConfigModalProps) {
  const [supadataKey, setSupadataKey] = useState(initialKeys.supadataKey);
  const [openaiKey, setOpenaiKey] = useState(initialKeys.openaiKey);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    setSupadataKey(initialKeys.supadataKey);
    setOpenaiKey(initialKeys.openaiKey);
  }, [initialKeys]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ supadataKey: supadataKey.trim(), openaiKey: openaiKey.trim() });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            API Configuration
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded"
            aria-label="Close configuration"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="supadata-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <a
                href="https://supadata.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                aria-label="Get Supadata API key"
              >
                SUPADATA_API_KEY
              </a>
            </label>
            <input
              id="supadata-key"
              type={showKeys ? "text" : "password"}
              value={supadataKey}
              onChange={(e) => setSupadataKey(e.target.value)}
              placeholder="Enter your Supadata API key"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Supadata API key input"
            />
          </div>

          <div>
            <label htmlFor="openai-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                aria-label="Get OpenAI API key"
              >
                OPENAI_API_KEY
              </a>
            </label>
            <input
              id="openai-key"
              type={showKeys ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="OpenAI API key input"
            />
          </div>

          <div className="flex items-center">
            <input
              id="show-keys"
              type="checkbox"
              checked={showKeys}
              onChange={(e) => setShowKeys(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
            />
            <label htmlFor="show-keys" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
              Show API keys
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Cancel configuration"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Save API keys"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}