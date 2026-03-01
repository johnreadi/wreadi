import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout, ArrowRight, Home, Monitor, Settings, Package, Mail } from "lucide-react";
import Link from "next/link";

const PAGE_DEFINITIONS = [
    { slug: "home", name: "Accueil", icon: Home, color: "text-red-600", bg: "bg-red-50" },
    { slug: "affichage-dynamique", name: "Affichage Dynamique", icon: Monitor, color: "text-blue-600", bg: "bg-blue-50" },
    { slug: "informatique-maintenance", name: "Informatique & Maintenance", icon: Settings, color: "text-green-600", bg: "bg-green-50" },
    { slug: "pieces-detachees", name: "Pièces Détachées", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { slug: "contact", name: "Contact", icon: Mail, color: "text-purple-600", bg: "bg-purple-50" },
];

async function getPagesStats() {
    const stats = await prisma.pageContent.findMany({
        include: { _count: { select: { sections: true } } }
    });
    return stats;
}

export default async function PagesAdminList() {
    const stats = await getPagesStats();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Layout className="h-8 w-8 text-red-600" />
                    Pages & Sections
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PAGE_DEFINITIONS.map((p) => {
                    const pageStat = stats.find(s => s.pageSlug === p.slug);
                    const sectionCount = pageStat?._count?.sections || 0;

                    return (
                        <Card key={p.slug} className="hover:shadow-lg transition-all border-2 border-transparent hover:border-red-100 h-full flex flex-col">
                            <CardHeader>
                                <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <p.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{p.name}</CardTitle>
                                <CardDescription>Gérez le contenu riche de la page {p.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500">Sections actives</span>
                                    <Badge variant="secondary">{sectionCount}</Badge>
                                </div>
                                <Button asChild className="w-full bg-white border-red-100 text-red-600 hover:bg-red-50" variant="outline">
                                    <Link href={`/admin/content/pages/${p.slug}`}>
                                        Configurer la page
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
