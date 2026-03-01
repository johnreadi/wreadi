import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, LayoutGrid, Award, Monitor, Package, Megaphone, Mail } from "lucide-react";
import Link from "next/link";

async function getContentStats() {
    const [categories, services, testimonials, landingPages] = await Promise.all([
        prisma.category.count(),
        prisma.service.count(),
        prisma.testimonial.count(),
        // @ts-ignore
        prisma.landingPage.count(),
    ]);
    return { categories, services, testimonials, landingPages };
}

export default async function ContentManagementPage() {
    const stats = await getContentStats();

    const sections = [
        {
            title: "Pages & Sections",
            description: "Modifiez la structure, les Heros et les blocs dynamiques de vos pages.",
            count: 5,
            href: "/admin/content/pages",
            icon: LayoutGrid,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Catégories",
            description: "Gérez les grandes sections de services (Informatique, Affichage, etc.)",
            count: stats.categories,
            href: "/admin/content/categories",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Services détaillés",
            description: "Modifiez les descriptions, images et fonctionnalités de chaque service.",
            count: stats.services,
            href: "/admin/content/services",
            icon: Monitor,
            color: "text-red-600",
            bg: "bg-red-50",
        },
        {
            title: "Témoignages",
            description: "Ajoutez ou masquez les avis clients pour renforcer la confiance.",
            count: stats.testimonials,
            href: "/admin/content/testimonials",
            icon: Award,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
        {
            title: "Campagnes Marketing",
            description: "Pages d'atterrissage (Landing Pages) pour vos publicités.",
            count: stats.landingPages,
            href: "/admin/content/landing-pages",
            icon: Megaphone,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Configuration Pièces & Accès",
            description: "Modifiez le Hero et les blocs de la page catalogue pièces.",
            count: 1,
            href: "/admin/content/pages/pieces-detachees",
            icon: Package,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Configuration Formulaire",
            description: "Modifiez les textes, les héros et les réglages de la page contact.",
            count: 1,
            href: "/admin/content/pages/contact",
            icon: Mail,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gestion du Contenu</h1>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/" target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le site en direct
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Card key={section.title} className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-red-100 flex flex-col">
                        <CardHeader>
                            <div className={`w-12 h-12 ${section.bg} ${section.color} rounded-lg flex items-center justify-center mb-4`}>
                                <section.icon className="h-6 w-6" />
                            </div>
                            <CardTitle>{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium text-gray-500">Éléments publiés</span>
                                <Badge variant="secondary" className="text-lg px-3">
                                    {section.count}
                                </Badge>
                            </div>
                            <Button asChild className="w-full" variant="outline">
                                <Link href={section.href}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Modifier la section
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
