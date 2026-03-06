"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";
import nodemailer from "nodemailer";

export async function testSmtpConfiguration(settings: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    to: string;
}) {
    try {
        const transporter = nodemailer.createTransport({
            host: settings.host,
            port: settings.port,
            secure: settings.port === 465, // true for 465, false for other ports
            auth: {
                user: settings.user,
                pass: settings.pass,
            },
            tls: {
                rejectUnauthorized: false, // Useful for some self-signed certs or dev envs
            },
        });

        // Verify connection configuration
        await transporter.verify();

        // Send test email
        await transporter.sendMail({
            from: settings.from,
            to: settings.to,
            subject: "Test de configuration SMTP - READI",
            text: "Ceci est un email de test pour valider votre configuration SMTP. Si vous recevez ce message, votre configuration est correcte.",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #16a34a;">Test de configuration réussi ! ✅</h2>
                    <p>Ceci est un email de test envoyé depuis votre panneau d'administration READI.</p>
                    <p><strong>Détails de la configuration testée :</strong></p>
                    <ul>
                        <li>Hôte : ${settings.host}</li>
                        <li>Port : ${settings.port}</li>
                        <li>Utilisateur : ${settings.user}</li>
                        <li>Expéditeur : ${settings.from}</li>
                    </ul>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Ce message a été généré automatiquement.</p>
                </div>
            `,
        });

        return { success: true };
    } catch (error: any) {
        console.error("SMTP Test Error:", error);
        return { success: false, error: error.message || "Une erreur inconnue est survenue" };
    }
}

export async function updateAppearance(formData: FormData) {
    const siteName = (formData.get("siteName") as string) || "READI.FR";
    const siteSlogan = (formData.get("siteSlogan") as string) || "";
    const primaryColor = (formData.get("primaryColor") as string) || "#dc2626";
    const fontFamily = (formData.get("fontFamily") as string) || "Inter";
    const baseFontSize = (formData.get("baseFontSize") as string) || "16px";

    // Champs de contact
    const contactEmail = (formData.get("contactEmail") as string) || "";
    const contactPhone = (formData.get("contactPhone") as string) || "";
    const contactAddress = (formData.get("contactAddress") as string) || "";
    const contactHours = (formData.get("contactHours") as string) || "";
    const contactMapUrl = (formData.get("contactMapUrl") as string) || "";

    // Champs Légaux
    const privacyPolicy = (formData.get("privacyPolicy") as string) || "";
    const termsOfService = (formData.get("termsOfService") as string) || "";

    // Champs Header & TopBar
    const headerBgColor = (formData.get("headerBgColor") as string) || "#ffffff";
    const headerTextColor = (formData.get("headerTextColor") as string) || "#1f2937";
    const headerFontSize = (formData.get("headerFontSize") as string) || "16px";
    
    const topBarEnabled = formData.get("topBarEnabled") === "true";
    const topBarBgColor = (formData.get("topBarBgColor") as string) || "#000000";
    const topBarTextColor = (formData.get("topBarTextColor") as string) || "#ffffff";

    const logoFile = formData.get("logo") as File;
    const logoUrl = formData.get("logoUrl") as string;
    const logoInputType = formData.get("logoInputType") as string;
    let logoPath: string | undefined = undefined;

    // Log pour debug
    console.log("UpdateAppearance:", { 
        logoInputType, 
        logoUrl: logoUrl ? logoUrl.substring(0, 50) : "null", 
        logoFile: logoFile ? { name: logoFile.name, size: logoFile.size } : "null" 
    });

    if (logoInputType === "url") {
        if (logoUrl && logoUrl.trim() !== "") {
            logoPath = logoUrl;
        }
    } else if (logoInputType === "file") {
        if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
            try {
                const uploadedPath = await handleFileUpload(logoFile);
                if (uploadedPath) {
                    logoPath = uploadedPath;
                } else {
                    console.error("Upload returned null without error");
                }
            } catch (e: any) {
                console.error("Upload failed:", e);
                throw new Error("Erreur lors de l'upload du logo: " + e.message);
            }
        }
    } else {
        // Fallback pour compatibilité si logoInputType n'est pas envoyé (ex: vieux cache)
        if (logoUrl && logoUrl.trim() !== "") {
            logoPath = logoUrl;
        }
        if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
            const uploadedPath = await handleFileUpload(logoFile);
            if (uploadedPath) {
                logoPath = uploadedPath;
            }
        }
    }

    try {
        // @ts-ignore
        await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: {
                siteName,
                siteSlogan,
                primaryColor,
                fontFamily,
                baseFontSize,
                contactEmail,
                contactPhone,
                contactAddress,
                contactHours,
                contactMapUrl,
                privacyPolicy,
                termsOfService,
                headerBgColor,
                headerTextColor,
                headerFontSize,
                topBarEnabled,
                topBarBgColor,
                topBarTextColor,
                ...(logoPath ? { siteLogo: logoPath } : {}),
            } as any,
            create: {
                id: "default",
                siteName,
                siteSlogan,
                primaryColor,
                fontFamily,
                baseFontSize,
                contactEmail,
                contactPhone,
                contactAddress,
                contactHours,
                contactMapUrl,
                privacyPolicy,
                termsOfService,
                headerBgColor,
                headerTextColor,
                headerFontSize,
                topBarEnabled,
                topBarBgColor,
                topBarTextColor,
                siteLogo: logoPath || null,
            } as any,
        });
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        throw new Error("Impossible de sauvegarder les paramètres. Vérifiez les logs serveur.");
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    revalidatePath("/contact");
}

export async function getAppearanceSettings() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: "default" }
        });
        return settings;
    } catch (e) {
        console.error("Error fetching settings:", e);
        return null;
    }
}

export async function updateSmtpSettings(formData: FormData) {
    const emailSmtpHost = (formData.get("emailSmtpHost") as string) || null;
    const emailSmtpPort = parseInt((formData.get("emailSmtpPort") as string) || "587");
    const emailSmtpUser = (formData.get("emailSmtpUser") as string) || null;
    const emailSmtpPass = (formData.get("emailSmtpPass") as string) || null;
    const emailRecipients = (formData.get("emailRecipients") as string) || null;
    const emailFrom = (formData.get("emailFrom") as string) || null;

    try {
        await prisma.siteSettings.upsert({
            where: { id: "default" },
            update: {
                emailSmtpHost,
                emailSmtpPort,
                emailSmtpUser,
                emailSmtpPass,
                emailRecipients,
                emailFrom,
            },
            create: {
                id: "default",
                emailSmtpHost,
                emailSmtpPort,
                emailSmtpUser,
                emailSmtpPass,
                emailRecipients,
                emailFrom,
            }
        });
    } catch (error: any) {
        console.error("Failed to update SMTP settings:", error);
        // If update fails because record doesn't exist, we should probably handle it.
        // But for now, let's assume the user has saved general settings at least once.
        throw new Error("Impossible de sauvegarder la configuration SMTP. Assurez-vous d'avoir sauvegardé les paramètres généraux d'abord.");
    }

    revalidatePath("/admin/settings");
}
