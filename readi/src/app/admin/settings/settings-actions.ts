"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

    const logoFile = formData.get("logo") as File;
    let logoPath: string | undefined = undefined;

    if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // S'assurer que le répertoire existe
        const uploadDir = join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
        const fullPath = join(uploadDir, fileName);
        await writeFile(fullPath, buffer);
        logoPath = `/uploads/${fileName}`;
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
