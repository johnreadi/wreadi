import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cableTypes = await prisma.cableType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(cableTypes);
  } catch (error) {
    console.error("Error fetching cable types:", error);
    return NextResponse.json(
      { error: "Failed to fetch cable types" },
      { status: 500 }
    );
  }
}
