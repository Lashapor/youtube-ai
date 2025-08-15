type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p className="text-red-700 dark:text-red-400" role="alert">
        {message}
      </p>
    </div>
  );
}