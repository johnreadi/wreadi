import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Sauvegarder dans la base de données (Toujours fiable)
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // 1.5 Créer également une conversation pour l'interface de messagerie admin
    try {
        const conversation = await prisma.conversation.create({
            data: {
                subject: subject,
                participantName: name,
                participantEmail: email,
                status: "OPEN",
                messages: {
                    create: {
                        content: message,
                        senderType: "USER",
                        isRead: false
                    }
                }
            }
        });
        console.log("Conversation created:", conversation.id);
    } catch (convError) {
        console.error("Failed to create conversation:", convError);
        // On ne bloque pas si ça échoue, car le ContactMessage est déjà sauvé
    }

    // 2. Envoyer un email si la configuration est présente
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" }
        });

        if (settings) {
            
            // Déterminer les destinataires
            let recipients: string[] = [];
            if (settings.emailRecipients) {
                recipients = settings.emailRecipients.split(',').map(r => r.trim()).filter(r => r);
            }
            
            // Fallback sur contactEmail si pas de destinataires spécifiques
            if (recipients.length === 0 && settings.contactEmail) {
                recipients.push(settings.contactEmail);
            }

            if (recipients.length > 0) {
                const result = await sendEmail({
                    to: recipients.join(', '),
                    subject: `[Contact READI] ${subject}`,
                    text: `Nouveau message de ${name} (${email})\n\nTéléphone: ${phone || 'Non renseigné'}\n\nMessage:\n${message}`,
                    html: `
                        <h3>Nouveau message de contact</h3>
                        <p><strong>De:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                        <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
                        <p><strong>Sujet:</strong> ${subject}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                    `
                });

                if (!result.success) {
                    console.error("Failed to send email notification:", result.error);
                }
            } else {
                console.warn("No recipients configured for contact form notifications.");
            }
        }
    } catch (emailError) {
        console.error("Error in email notification logic:", emailError);
    }

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
