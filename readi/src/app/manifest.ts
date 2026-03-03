import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'READI.FR - Expert Affichage Dynamique & Informatique',
    short_name: 'READI',
    description: 'Expert en affichage dynamique et maintenance informatique. La Compétence depuis plus de 30 ans.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      }
    ],
  };
}
