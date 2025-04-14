'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="rounded-lg bg-red-50 p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h1>
        
        {error.message && (
          <div className="mb-4 rounded-md bg-red-100 p-4">
            <p className="text-sm text-red-800">{error.message}</p>
          </div>
        )}
        
        <p className="mb-6 text-gray-700">
          Try refreshing the page or check your connection to the database.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Try again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Refresh page
          </button>
        </div>
      </div>
    </div>
  );
}

