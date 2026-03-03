'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Nous n'avons pas pu charger cette page correctement. Veuillez réessayer ou contacter le support si le problème persiste.
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => reset()}
          variant="default"
          className="bg-red-600 hover:bg-red-700"
        >
          Réessayer
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
        >
          Retour à l'accueil
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left w-full max-w-lg overflow-auto text-xs font-mono text-gray-700">
          <p className="font-bold mb-2">Error Details:</p>
          {error.message}
        </div>
      )}
    </div>
  );
}
