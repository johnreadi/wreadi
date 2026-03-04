"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

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

interface AttachmentData {
    url: string;
    name: string;
    type: string;
    size: number;
}

export async function createConversation(
    participantEmail: string, 
    participantName: string, 
    subject: string, 
    message: string, 
    attachments: AttachmentData[] = []
) {
    // Check if conversation already exists for this email with same subject (optional, but good practice)
    // For now, let's just create a new one as subjects might vary

    const conversation = await prisma.conversation.create({
        data: {
            participantEmail,
            participantName,
            subject,
            status: "OPEN",
            messages: {
                create: {
                    content: message,
                    senderType: "ADMIN",
                    isRead: true, // Since admin created it
                    attachments: {
                        create: attachments.map(att => ({
                            fileName: att.name,
                            fileUrl: att.url,
                            fileType: att.type,
                            fileSize: att.size
                        }))
                    }
                }
            }
        },
        include: {
            messages: {
                include: {
                    attachments: true
                }
            }
        }
    });

    // Send email to user
    const emailAttachments = attachments.map(att => ({
        filename: att.name,
        path: `public${att.url}` // Assumes url starts with /
    }));

    await sendEmail({
        to: participantEmail,
        subject,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        text: message,
        attachments: emailAttachments
    });

    revalidatePath("/admin/messaging");
    return conversation;
}

export async function sendMessage(
    conversationId: string, 
    content: string, 
    senderType: "ADMIN" | "USER" = "ADMIN",
    attachments: AttachmentData[] = []
) {
    const message = await prisma.message.create({
        data: {
            conversationId,
            content,
            senderType,
            attachments: {
                create: attachments.map(att => ({
                    fileName: att.name,
                    fileUrl: att.url,
                    fileType: att.type,
                    fileSize: att.size
                }))
            }
        },
        include: {
            attachments: true
        }
    });

    const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
    });

    // Send email notification to user if sender is ADMIN
    if (senderType === "ADMIN") {
        const emailAttachments = attachments.map(att => ({
            filename: att.name,
            path: `public${att.url}`
        }));

        await sendEmail({
            to: conversation.participantEmail,
            subject: `Re: ${conversation.subject || 'Votre message'}`,
            html: `<p>${content.replace(/\n/g, '<br>')}</p>`,
            text: content,
            attachments: emailAttachments
        });
    }

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

export async function updateConversationNotes(conversationId: string, internalNotes: string) {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { internalNotes },
    });
    revalidatePath("/admin/messaging");
}

export async function updateConversationTags(conversationId: string, tags: string) {
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { tags },
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
