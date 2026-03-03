"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";
import type { MenuItem, TopBarItem } from "@prisma/client";

// --- MENU ACTIONS ---

export async function getMenuItems(): Promise<MenuItem[]> {
    try {
        return await prisma.menuItem.findMany({
            orderBy: { order: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return [];
    }
}

export async function createMenuItem(data: { label: string; href: string; target?: string }) {
    const count = await prisma.menuItem.count();
    await prisma.menuItem.create({
        data: {
            label: data.label,
            href: data.href,
            target: data.target || "_self",
            order: count,
        }
    });
    revalidatePath("/", "layout");
}

export async function updateMenuItem(id: string, data: { label: string; href: string; target?: string }) {
    await prisma.menuItem.update({
        where: { id },
        data
    });
    revalidatePath("/", "layout");
}

export async function deleteMenuItem(id: string) {
    await prisma.menuItem.delete({ where: { id } });
    revalidatePath("/", "layout");
}

export async function reorderMenuItems(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.menuItem.update({
            where: { id: item.id },
            data: { order: item.order }
        });
    }
    revalidatePath("/", "layout");
}

// --- TOP BAR ACTIONS ---

export async function getTopBarItems(): Promise<TopBarItem[]> {
    try {
        return await prisma.topBarItem.findMany({
            orderBy: { order: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching top bar items:", error);
        return [];
    }
}

export async function createTopBarItem(formData: FormData) {
    const type = formData.get("type") as string;
    let content = formData.get("content") as string;
    const settings = formData.get("settings") as string;
    
    // Handle file upload if type is IMAGE
    if (type === "IMAGE") {
        const file = formData.get("file") as File;
        const uploadedPath = await handleFileUpload(file);
        if (uploadedPath) {
            content = uploadedPath;
        }
    }

    const count = await prisma.topBarItem.count();
    const newItem = await prisma.topBarItem.create({
        data: {
            type,
            content,
            settings: settings || null,
            order: count,
        }
    });
    revalidatePath("/", "layout");
    return newItem;
}

export async function updateTopBarItem(id: string, formData: FormData) {
    const type = formData.get("type") as string;
    let content = formData.get("content") as string;
    const settings = formData.get("settings") as string;

    // Handle file upload if type is IMAGE
    if (type === "IMAGE") {
        const file = formData.get("file") as File;
        const uploadedPath = await handleFileUpload(file);
        if (uploadedPath) {
            content = uploadedPath;
        }
    }

    const updatedItem = await prisma.topBarItem.update({
        where: { id },
        data: {
            type,
            content,
            settings: settings || null,
        }
    });
    revalidatePath("/", "layout");
    return updatedItem;
}

export async function deleteTopBarItem(id: string) {
    await prisma.topBarItem.delete({ where: { id } });
    revalidatePath("/", "layout");
}

export async function reorderTopBarItems(items: { id: string; order: number }[]) {
    for (const item of items) {
        await prisma.topBarItem.update({
            where: { id: item.id },
            data: { order: item.order }
        });
    }
    revalidatePath("/", "layout");
}
