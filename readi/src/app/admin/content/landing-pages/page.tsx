import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LandingPageList } from "@/components/admin/LandingPageList";

export default async function AdminLandingPagesPage() {
    const landingPages = await prisma.landingPage.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <LandingPageList initialLandingPages={landingPages as any} />
        </div>
    );
}
