"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function addPageSection(pageSlug: string, data: any) {
    const page = await prisma.pageContent.findUnique({ where: { pageSlug } });
    if (!page) throw new Error("Page not found");

    await prisma.pageSection.create({
        data: {
            ...data,
            pageContentId: page.id,
        },
    });
    revalidatePath("/", "layout");
    revalidatePath(`/admin/content/pages/${pageSlug}`);
    revalidatePath(pageSlug === 'home' ? '/' : `/${pageSlug}`);
}

export async function updatePageSection(id: string, data: any) {
    const section = await prisma.pageSection.update({
        where: { id },
        data,
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
