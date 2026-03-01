"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getConversations() {
    return prisma.conversation.findMany({
        orderBy: { lastMessageAt: "desc" },
        include: {
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });
}

export async function getConversationMessages(conversationId: string) {
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            attachments: true,
        },
    });
}

export async function sendMessage(conversationId: string, content: string, senderType: "ADMIN" | "USER" = "ADMIN") {
    const message = await prisma.message.create({
        data: {
            conversationId,
            content,
            senderType,
        },
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
    });

    revalidatePath("/admin/messaging");
    return message;
}

export async function updateConversationStatus(conversationId: string, status: string) {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { status },
    });
    revalidatePath("/admin/messaging");
}

export async function deleteConversation(conversationId: string) {
    await prisma.conversation.delete({
        where: { id: conversationId },
    });
    revalidatePath("/admin/messaging");
}

export async function archiveConversation(conversationId: string) {
    return updateConversationStatus(conversationId, "ARCHIVED");
}
