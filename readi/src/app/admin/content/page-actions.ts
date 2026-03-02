"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Utility function to handle file upload
async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file || file.size === 0 || file.name === "undefined") return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating upload directory:", e);
    }

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileName = `${Date.now()}-${cleanName}`;
    const fullPath = join(uploadDir, fileName);
    
    try {
        await writeFile(fullPath, buffer);
        return `/uploads/${fileName}`;
    } catch (e) {
        console.error("Error writing file:", e);
        throw new Error("Impossible d'écrire le fichier sur le disque.");
    }
}

export async function upsertPageContent(pageSlug: string, data: any) {
    const page = await prisma.pageContent.upsert({
        where: { pageSlug },
        update: data,
        create: { ...data, pageSlug },
    });
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/pages/${pageSlug}`);
    revalidatePath(pageSlug === 'home' ? '/' : `/${pageSlug}`);
    return page;
}

export async function addPageSection(pageSlug: string, formData: FormData) {
    const page = await prisma.pageContent.findUnique({ where: { pageSlug } });
    if (!page) throw new Error("Page not found");

    const file = formData.get("file") as File;
    let mediaUrl = formData.get("mediaUrl") as string;
    
    const uploadedPath = await handleFileUpload(file);
    if (uploadedPath) {
        mediaUrl = uploadedPath;
    }

    await prisma.pageSection.create({
        data: {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            content: formData.get("content") as string,
            mediaType: formData.get("mediaType") as string,
            mediaUrl,
            layout: formData.get("layout") as string,
            animation: formData.get("animation") as string,
            titleFontSize: formData.get("titleFontSize") as string,
            titleFontFamily: formData.get("titleFontFamily") as string,
            contentFontSize: formData.get("contentFontSize") as string,
            isActive: formData.get("isActive") === "on",
            order: parseInt(formData.get("order") as string) || 0,
            pageContentId: page.id,
        },
    });
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/pages/${pageSlug}`);
    revalidatePath(pageSlug === 'home' ? '/' : `/${pageSlug}`);
}

export async function updatePageSection(id: string, formData: FormData) {
    const file = formData.get("file") as File;
    let mediaUrl = formData.get("mediaUrl") as string;
    
    const uploadedPath = await handleFileUpload(file);
    if (uploadedPath) {
        mediaUrl = uploadedPath;
    }

    const section = await prisma.pageSection.update({
        where: { id },
        data: {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            content: formData.get("content") as string,
            mediaType: formData.get("mediaType") as string,
            mediaUrl,
            layout: formData.get("layout") as string,
            animation: formData.get("animation") as string,
            titleFontSize: formData.get("titleFontSize") as string,
            titleFontFamily: formData.get("titleFontFamily") as string,
            contentFontSize: formData.get("contentFontSize") as string,
            isActive: formData.get("isActive") === "on",
        },
        include: { pageContent: true }
    });
    const slug = section.pageContent.pageSlug;
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/pages/${slug}`);
    revalidatePath(slug === 'home' ? '/' : `/${slug}`);
}

export async function deletePageSection(id: string) {
    const section = await prisma.pageSection.delete({
        where: { id },
        include: { pageContent: true }
    });
    const slug = section.pageContent.pageSlug;
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/pages/${slug}`);
    revalidatePath(slug === 'home' ? '/' : `/${slug}`);
}

export async function reorderSections(ids: string[]) {
    await Promise.all(
        ids.map((id, index) =>
            prisma.pageSection.update({
                where: { id },
                data: { order: index },
            })
        )
    );
    revalidatePath("/", "layout");
}
