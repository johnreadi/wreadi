import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
  }[];
}

export async function sendEmail({ to, subject, html, text, attachments }: EmailOptions) {
  try {
    // 1. Récupérer la configuration SMTP depuis la base de données
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings?.emailSmtpHost || !settings?.emailSmtpUser || !settings?.emailSmtpPass) {
      console.warn("⚠️ Email configuration missing in SiteSettings. Email not sent.");
      return { success: false, error: "Configuration SMTP manquante" };
    }

    // 2. Créer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: settings.emailSmtpHost,
      port: settings.emailSmtpPort || 587,
      secure: settings.emailSmtpPort === 465, // true pour 465, false pour les autres
      auth: {
        user: settings.emailSmtpUser,
        pass: settings.emailSmtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Utile pour certains serveurs SMTP auto-signés ou développement
      },
    });

    // 3. Vérifier la connexion (optionnel mais recommandé pour le debug)
    // await transporter.verify();

    // 4. Envoyer l'email
    const info = await transporter.sendMail({
      from: `"${settings.siteName || 'READI'}" <${settings.emailFrom || settings.emailSmtpUser}>`, // expéditeur
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback texte brut
      html,
      attachments,
    });

    console.log("✅ Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}
