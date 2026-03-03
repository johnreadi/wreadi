"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createLandingPage(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const description = formData.get("description") as string;
    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const isActive = formData.get("isActive") === "on";
    const backgroundColor = formData.get("backgroundColor") as string;

    const heroImageFile = formData.get("heroImageFile") as File;
    const heroVideoFile = formData.get("heroVideoFile") as File;
    const heroImageUrl = formData.get("heroImageUrl") as string;
    const heroVideoUrl = formData.get("heroVideoUrl") as string;

    let heroImage = heroImageUrl || formData.get("heroImage") as string || "";
    let heroVideo = heroVideoUrl || formData.get("heroVideo") as string || "";

    const uploadedImage = await handleFileUpload(heroImageFile);
    if (uploadedImage) heroImage = uploadedImage;

    const uploadedVideo = await handleFileUpload(heroVideoFile);
    if (uploadedVideo) heroVideo = uploadedVideo;

    await prisma.landingPage.create({
        data: {
            title,
            slug,
            description,
            heroTitle,
            heroSubtitle,
            heroImage,
            heroVideo,
            backgroundColor,
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
    const backgroundColor = formData.get("backgroundColor") as string;

    const heroImageFile = formData.get("heroImageFile") as File;
    const heroVideoFile = formData.get("heroVideoFile") as File;
    const heroImageUrl = formData.get("heroImageUrl") as string;
    const heroVideoUrl = formData.get("heroVideoUrl") as string;

    let heroImage = formData.get("heroImage") as string;
    let heroVideo = formData.get("heroVideo") as string;

    if (heroImageUrl && heroImageUrl.trim() !== "") heroImage = heroImageUrl;
    if (heroVideoUrl && heroVideoUrl.trim() !== "") heroVideo = heroVideoUrl;

    const uploadedImage = await handleFileUpload(heroImageFile);
    if (uploadedImage) heroImage = uploadedImage;

    const uploadedVideo = await handleFileUpload(heroVideoFile);
    if (uploadedVideo) heroVideo = uploadedVideo;

    await prisma.landingPage.update({
        where: { id },
        data: {
            title,
            slug,
            description,
            heroTitle,
            heroSubtitle,
            heroImage,
            heroVideo,
            backgroundColor,
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
