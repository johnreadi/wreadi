"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createTestimonial(formData: FormData) {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const imageInputType = formData.get("imageInputType") as string;
    let image = imageUrl || null;

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

    await prisma.testimonial.create({
        data: {
            name,
            company,
            content,
            rating,
            image,
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

    const imageFile = formData.get("imageFile") as File;
    const imageUrl = formData.get("imageUrl") as string;
    const imageInputType = formData.get("imageInputType") as string;
    let image = formData.get("image") as string;

    if (imageInputType === "url") {
        if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
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
        if (imageUrl && imageUrl.trim() !== "") image = imageUrl;
        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) {
            image = uploadedImage;
        }
    }

    await prisma.testimonial.update({
        where: { id },
        data: {
            name,
            company,
            content,
            rating,
            image,
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
