import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServiceList } from "@/components/admin/ServiceList";

export default async function AdminServicesPage() {
    const [services, categories] = await Promise.all([
        prisma.service.findMany({
            include: {
                category: {
                    select: { name: true }
                }
            },
            orderBy: { categoryId: "asc" }
        }),
        prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" }
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <ServiceList
                initialServices={services as any}
                categories={categories}
            />
        </div>
    );
}

