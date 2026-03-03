'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-black text-red-600 mb-4">Oups !</h2>
            <p className="text-gray-600 mb-8">
              Une erreur critique est survenue. Notre équipe a été notifiée.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left mb-8 overflow-auto max-h-40 text-xs font-mono text-gray-700">
              {error.message}
              {error.digest && <div className="mt-2 text-gray-500">Digest: {error.digest}</div>}
            </div>
            <Button 
              onClick={() => reset()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
