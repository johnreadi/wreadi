"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(formData: FormData) {
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const isActive = formData.get("isActive") === "on";

    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    await prisma.service.create({
        data: {
            name,
            slug,
            categoryId,
            description,
            shortDesc,
            isActive,
        },
    });

    revalidatePath("/admin/content/services");
}

export async function updateService(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.service.update({
        where: { id },
        data: {
            name,
            categoryId,
            description,
            shortDesc,
            isActive,
        },
    });

    revalidatePath("/admin/content/services");
}

export async function toggleServiceStatus(id: string, currentStatus: boolean) {
    await prisma.service.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/content/services");
}

export async function deleteService(id: string) {
    await prisma.service.delete({
        where: { id },
    });

    revalidatePath("/admin/content/services");
}
