import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

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

    // 2. Envoyer un email si la configuration est présente
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" }
        });

        if (settings && settings.emailSmtpHost && settings.emailSmtpUser && settings.emailSmtpPass) {
            
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
                const transporter = nodemailer.createTransport({
                    host: settings.emailSmtpHost,
                    port: settings.emailSmtpPort || 587,
                    secure: settings.emailSmtpPort === 465, // true for 465, false for other ports
                    auth: {
                        user: settings.emailSmtpUser,
                        pass: settings.emailSmtpPass,
                    },
                    tls: {
                        rejectUnauthorized: false // Often needed for some SMTP servers during dev/prod if certs are tricky
                    }
                });

                const mailOptions = {
                    from: settings.emailFrom || settings.emailSmtpUser, // Sender address
                    to: recipients.join(', '), // List of receivers
                    replyTo: email, // Reply to the user's email
                    subject: `[Contact READI] ${subject}`, // Subject line
                    text: `Nouveau message de ${name} (${email})\n\nTéléphone: ${phone || 'Non renseigné'}\n\nMessage:\n${message}`, // plain text body
                    html: `
                        <h3>Nouveau message de contact</h3>
                        <p><strong>De:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                        <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
                        <p><strong>Sujet:</strong> ${subject}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    `, // html body
                };

                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully to:", recipients);
            } else {
                console.warn("No recipients configured for contact form emails.");
            }
        } else {
            console.log("SMTP settings incomplete, skipping email sending.");
        }
    } catch (emailError) {
        // On ne veut pas bloquer la réponse si l'envoi d'email échoue, mais on log l'erreur
        console.error("Failed to send email notification:", emailError);
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
