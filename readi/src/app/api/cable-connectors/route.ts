import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get("typeId");

    if (!typeId) {
      return NextResponse.json(
        { error: "typeId is required" },
        { status: 400 }
      );
    }

    const connectors = await prisma.cableConnector.findMany({
      where: { 
        cableTypeId: typeId,
        isActive: true 
      },
      orderBy: { name: "asc" },
    });
    
    return NextResponse.json(connectors);
  } catch (error) {
    console.error("Error fetching cable connectors:", error);
    return NextResponse.json(
      { error: "Failed to fetch cable connectors" },
      { status: 500 }
    );
  }
}
