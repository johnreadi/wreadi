"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const iconFile = formData.get("iconFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const iconUrl = formData.get("iconUrl") as string;
    let image = imageUrl || null;
    let icon = iconUrl || null;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) image = uploadedImage;

    const uploadedIcon = await handleFileUpload(iconFile);
    if (uploadedIcon) icon = uploadedIcon;

    await prisma.category.create({
        data: {
            name,
            slug,
            description,
            image,
            icon,
            isActive,
        },
    });

    revalidatePath("/admin/content/categories");
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const iconFile = formData.get("iconFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const iconUrl = formData.get("iconUrl") as string;
    let image = formData.get("image") as string;
    let icon = formData.get("icon") as string;

    if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
    if (iconUrl && iconUrl.trim() !== "") icon = iconUrl;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) image = uploadedImage;

    const uploadedIcon = await handleFileUpload(iconFile);
    if (uploadedIcon) icon = uploadedIcon;

    await prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            image,
            icon,
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
