"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createService(formData: FormData) {
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const iconFile = formData.get("iconFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const iconUrl = formData.get("iconUrl") as string;
    let image = imageUrl || formData.get("image") as string;
    let icon = iconUrl || formData.get("icon") as string;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) image = uploadedImage;

    const uploadedIcon = await handleFileUpload(iconFile);
    if (uploadedIcon) icon = uploadedIcon;

    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    await prisma.service.create({
        data: {
            name,
            slug,
            categoryId,
            description,
            shortDesc,
            image,
            icon,
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

    const imageFile = formData.get("imageFile") as File;
    const iconFile = formData.get("iconFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const iconUrl = formData.get("iconUrl") as string;
    let image = formData.get("image") as string;
    let icon = formData.get("icon") as string;

    if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
    if (iconUrl && iconUrl.trim() !== "") icon = iconUrl;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) {
        image = uploadedImage;
    }

    const uploadedIcon = await handleFileUpload(iconFile);
    if (uploadedIcon) {
        icon = uploadedIcon;
    }

    await prisma.service.update({
        where: { id },
        data: {
            name,
            categoryId,
            description,
            shortDesc,
            isActive,
            image,
            icon,
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
