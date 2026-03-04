"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

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

    const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
    });

    // Send email notification to user if sender is ADMIN
    if (senderType === "ADMIN") {
        try {
            const settings = await prisma.siteSettings.findUnique({
                where: { id: "default" }
            });

            if (settings && settings.emailSmtpHost && settings.emailSmtpUser && settings.emailSmtpPass && conversation.participantEmail) {
                const transporter = nodemailer.createTransport({
                    host: settings.emailSmtpHost,
                    port: settings.emailSmtpPort || 587,
                    secure: settings.emailSmtpPort === 465,
                    auth: {
                        user: settings.emailSmtpUser,
                        pass: settings.emailSmtpPass,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                const mailOptions = {
                    from: settings.emailFrom || settings.emailSmtpUser,
                    to: conversation.participantEmail,
                    subject: `Re: ${conversation.subject || 'Votre message'}`,
                    text: content,
                    html: `
                        <p>${content.replace(/\n/g, '<br>')}</p>
                        <hr />
                        <p style="font-size: 12px; color: #666;">Ceci est une réponse à votre message sur ${settings.siteName || 'notre site'}.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
            }
        } catch (error) {
            console.error("Failed to send email reply:", error);
            // Don't throw, just log. The message is saved in DB.
        }
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
