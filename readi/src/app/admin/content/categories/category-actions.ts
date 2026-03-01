"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.category.create({
        data: {
            name,
            slug,
            description,
            isActive,
        },
    });

    revalidatePath("/admin/content/categories");
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            isActive,
        },
    });

    revalidatePath("/admin/content/categories");
}

export async function toggleCategoryStatus(id: string, currentStatus: boolean) {
    await prisma.category.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/content/categories");
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: { id },
    });

    revalidatePath("/admin/content/categories");
}
