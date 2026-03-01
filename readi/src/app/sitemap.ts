import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://readi.fr';

    // 1. Pages Statiques
    const staticPages = [
        '',
        '/contact',
        '/pieces-detachees',
        '/services',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Catégories Dynamiques
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

    // 3. Landing Pages Marketing
    const landingPages = await (prisma as any).landingPage.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
    });

    const marketingPages = landingPages.map((lp: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/lp/${lp.slug}`,
        lastModified: lp.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...categoryPages, ...marketingPages];
}
