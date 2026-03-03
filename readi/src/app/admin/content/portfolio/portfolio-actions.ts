"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createPortfolioItem(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const imageInputType = formData.get("imageInputType") as string;
    let image = imageUrl || "";

    if (imageInputType === "file") {
        try {
            const uploadedImage = await handleFileUpload(imageFile);
            if (uploadedImage) {
                image = uploadedImage;
            }
        } catch (e) {
            console.error("Image upload failed:", e);
        }
    } else if (!imageInputType) {
        // Fallback
        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) {
            image = uploadedImage;
        }
    }

    await prisma.portfolioItem.create({
        data: {
            title,
            description,
            category,
            image,
            isActive,
        },
    });

    revalidatePath("/admin/content/portfolio");
}

export async function updatePortfolioItem(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const imageInputType = formData.get("imageInputType") as string;
    let image = formData.get("image") as string;

    if (imageInputType === "url") {
        if (imageUrl && imageUrl.trim() !== "") {
            image = imageUrl;
        }
    } else if (imageInputType === "file") {
        try {
            const uploadedImage = await handleFileUpload(imageFile);
            if (uploadedImage) {
                image = uploadedImage;
            }
        } catch (e) {
            console.error("Image upload failed:", e);
        }
    } else {
        // Fallback
        if (imageUrl && imageUrl.trim() !== "") {
            image = imageUrl;
        }
        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) {
            image = uploadedImage;
        }
    }

    await prisma.portfolioItem.update({
        where: { id },
        data: {
            title,
            description,
            category,
            image,
            isActive,
        },
    });

    revalidatePath("/admin/content/portfolio");
}

export async function togglePortfolioItemStatus(id: string, currentStatus: boolean) {
    await prisma.portfolioItem.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/content/portfolio");
}

export async function deletePortfolioItem(id: string) {
    await prisma.portfolioItem.delete({
        where: { id },
    });

    revalidatePath("/admin/content/portfolio");
}
