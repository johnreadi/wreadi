import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Save to public/uploads directory
    // Note: In production, you might want to use S3 or similar
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, filename);
    
    // Ensure directory exists (fs/promises doesn't have existsSync, but mkdir with recursive handles it)
    const { mkdir } = require("fs/promises");
    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      name: file.name,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
