"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLandingPage(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const description = formData.get("description") as string;
    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.landingPage.create({
        data: {
            title,
            slug,
            description,
            heroTitle,
            heroSubtitle,
            isActive,
        },
    });

    revalidatePath("/admin/content/landing-pages");
}

export async function updateLandingPage(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.landingPage.update({
        where: { id },
        data: {
            title,
            slug,
            description,
            heroTitle,
            heroSubtitle,
            isActive,
        },
    });

    revalidatePath("/admin/content/landing-pages");
}

export async function toggleLandingPageStatus(id: string, currentStatus: boolean) {
    await prisma.landingPage.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/content/landing-pages");
}

export async function deleteLandingPage(id: string) {
    await prisma.landingPage.delete({
        where: { id },
    });

    revalidatePath("/admin/content/landing-pages");
}
