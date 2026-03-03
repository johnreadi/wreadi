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
    const imageInputType = formData.get("imageInputType") as string;
    const iconInputType = formData.get("iconInputType") as string;
    
    let image = imageUrl || null;
    let icon = iconUrl || null;

    if (imageInputType === "file") {
        try {
            const uploadedImage = await handleFileUpload(imageFile);
            if (uploadedImage) image = uploadedImage;
        } catch (e) {
            console.error("Image upload failed:", e);
        }
    } else if (!imageInputType) {
        // Fallback if js didn't send input type
        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) image = uploadedImage;
    }

    if (iconInputType === "file") {
        try {
            const uploadedIcon = await handleFileUpload(iconFile);
            if (uploadedIcon) icon = uploadedIcon;
        } catch (e) {
            console.error("Icon upload failed:", e);
        }
    } else if (!iconInputType) {
        // Fallback
        const uploadedIcon = await handleFileUpload(iconFile);
        if (uploadedIcon) icon = uploadedIcon;
    }

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
    const imageInputType = formData.get("imageInputType") as string;
    const iconInputType = formData.get("iconInputType") as string;
    
    let image = formData.get("image") as string;
    let icon = formData.get("icon") as string;

    // Handle Image
    if (imageInputType === "url") {
        if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
    } else if (imageInputType === "file") {
        try {
            const uploadedImage = await handleFileUpload(imageFile);
            if (uploadedImage) image = uploadedImage;
        } catch (e) {
            console.error("Image upload failed:", e);
        }
    } else {
        // Fallback for existing behavior
        if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) image = uploadedImage;
    }

    // Handle Icon
    if (iconInputType === "url") {
        if (iconUrl && iconUrl.trim() !== "") icon = iconUrl;
    } else if (iconInputType === "file") {
        try {
            const uploadedIcon = await handleFileUpload(iconFile);
            if (uploadedIcon) icon = uploadedIcon;
        } catch (e) {
            console.error("Icon upload failed:", e);
        }
    } else {
        // Fallback
        if (iconUrl && iconUrl.trim() !== "") icon = iconUrl;
        const uploadedIcon = await handleFileUpload(iconFile);
        if (uploadedIcon) icon = uploadedIcon;
    }

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
