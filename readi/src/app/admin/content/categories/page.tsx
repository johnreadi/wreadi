import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CategoryList } from "@/components/admin/CategoryList";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { services: true }
            }
        },
        orderBy: { order: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    {/* Le titre est géré dans le composant CategoryList pour garder la structure propre */}
                </div>
            </div>

            <CategoryList initialCategories={categories as any} />
        </div>
    );
}

