"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

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

    const backgroundColor = (formData.get("backgroundColorText") as string) || (formData.get("backgroundColor") as string);

    await prisma.pageSection.create({
        data: {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            content: formData.get("content") as string,
            mediaType: formData.get("mediaType") as string,
            mediaUrl,
            backgroundColor,
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

    const backgroundColor = (formData.get("backgroundColorText") as string) || (formData.get("backgroundColor") as string);

    const section = await prisma.pageSection.update({
        where: { id },
        data: {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            content: formData.get("content") as string,
            mediaType: formData.get("mediaType") as string,
            mediaUrl,
            backgroundColor,
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
