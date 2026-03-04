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
    await sendEmailNotification(participantEmail, subject, message, attachments);

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
        await sendEmailNotification(conversation.participantEmail, `Re: ${conversation.subject || 'Votre message'}`, content, attachments);
    }

    revalidatePath("/admin/messaging");
    return message;
}

async function sendEmailNotification(to: string, subject: string, content: string, attachments: AttachmentData[]) {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" }
        });

        if (settings && settings.emailSmtpHost && settings.emailSmtpUser && settings.emailSmtpPass) {
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

            const mailAttachments = attachments.map(att => ({
                filename: att.name,
                path: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}${att.url}` : `public${att.url}` // Note: This path logic might need adjustment depending on where files are stored relative to execution
                // For simplicity in this environment, let's assume public URL if accessible, or just file path if local
            }));
            
            // Adjust path for nodemailer if local file
            // If the url starts with /uploads/, and we are on the server, we might need the absolute path
            const fsAttachments = attachments.map(att => {
                // Assuming url is like /uploads/file.png
                // We need to point to the actual file on disk for nodemailer if we want to attach it directly
                // OR pass the URL if it's publicly accessible.
                // Let's try to construct the absolute path for reliability in this env
                const cleanUrl = att.url.startsWith('/') ? att.url.substring(1) : att.url;
                return {
                    filename: att.name,
                    path: `public/${cleanUrl}`
                };
            });

            const mailOptions = {
                from: settings.emailFrom || settings.emailSmtpUser,
                to: to,
                subject: subject,
                text: content,
                html: `
                    <p>${content.replace(/\n/g, '<br>')}</p>
                    <hr />
                    <p style="font-size: 12px; color: #666;">Ceci est un message de ${settings.siteName || 'notre site'}.</p>
                `,
                attachments: fsAttachments
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.error("Failed to send email reply:", error);
        // Don't throw, just log. The message is saved in DB.
    }
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
