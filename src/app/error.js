'use strict'; // Error components must be Client Components
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">We apologize for the inconvenience. Please try again.</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
      >
        Try again
      </button>
    </div>
  );
}
