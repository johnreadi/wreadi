"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTestimonial(formData: FormData) {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const isActive = formData.get("isActive") === "on";

    await prisma.testimonial.create({
        data: {
            name,
            company,
            content,
            rating,
            isActive,
        },
    });

    revalidatePath("/admin/content/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const isActive = formData.get("isActive") === "on";

    await prisma.testimonial.update({
        where: { id },
        data: {
            name,
            company,
            content,
            rating,
            isActive,
        },
    });

    revalidatePath("/admin/content/testimonials");
}

export async function toggleTestimonialStatus(id: string, currentStatus: boolean) {
    await prisma.testimonial.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/content/testimonials");
}

export async function deleteTestimonial(id: string) {
    await prisma.testimonial.delete({
        where: { id },
    });

    revalidatePath("/admin/content/testimonials");
}
