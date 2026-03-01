import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://readi.fr';

    // 1. Pages Statiques (toujours disponibles)
    const staticPages = [
        '',
        '/contact',
        '/pieces-detachees',
        '/affichage-dynamique',
        '/informatique-maintenance',
        '/configurateur-cables',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // 2. Catégories Dynamiques (avec fallback si DB inaccessible)
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        });

        const categoryPages = categories.map((cat) => ({
            url: `${baseUrl}/${cat.slug}`,
            lastModified: cat.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticPages, ...categoryPages];
    } catch (error) {
        // En cas d'erreur (build sans DB), retourner uniquement les pages statiques
        console.warn('Sitemap: Database not available during build, using static pages only');
        return staticPages;
    }
}
