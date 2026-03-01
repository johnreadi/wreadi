import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TestimonialList } from "@/components/admin/TestimonialList";

export default async function AdminTestimonialsPage() {
    const testimonials = await prisma.testimonial.findMany({
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
            </div>

            <TestimonialList initialTestimonials={testimonials as any} />
        </div>
    );
}

