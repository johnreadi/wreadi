"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- MENU ACTIONS ---

export async function getMenuItems() {
    return prisma.menuItem.findMany({
        orderBy: { order: 'asc' }
    });
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

export async function getTopBarItems() {
    return prisma.topBarItem.findMany({
        orderBy: { order: 'asc' }
    });
}

export async function createTopBarItem(data: { type: string; content: string; settings?: string }) {
    const count = await prisma.topBarItem.count();
    const newItem = await prisma.topBarItem.create({
        data: {
            type: data.type,
            content: data.content,
            settings: data.settings,
            order: count,
        }
    });
    revalidatePath("/", "layout");
    return newItem;
}

export async function updateTopBarItem(id: string, data: { type: string; content: string; settings?: string }) {
    const updatedItem = await prisma.topBarItem.update({
        where: { id },
        data
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
