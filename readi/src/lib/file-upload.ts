import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Handles file upload to the public/uploads directory.
 * @param file The file object from FormData
 * @returns The public URL of the uploaded file, or null if no file was provided or an error occurred.
 */
export async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file || file.size === 0 || file.name === "undefined") return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating upload directory:", e);
    }

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const fileName = `${Date.now()}-${cleanName}`;
    const fullPath = join(uploadDir, fileName);
    
    try {
        await writeFile(fullPath, buffer);
        return `/uploads/${fileName}`;
    } catch (e) {
        console.error("Error writing file:", e);
        throw new Error("Impossible d'écrire le fichier sur le disque.");
    }
}
