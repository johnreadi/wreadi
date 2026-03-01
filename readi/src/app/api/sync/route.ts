import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer toutes les données pour la synchronisation
export async function GET(request: NextRequest) {
  try {
    const [categories, services, products, cableTypes, cableConnectors, testimonials, pageContents] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      prisma.product.findMany({ where: { isActive: true } }),
      prisma.cableType.findMany(),
      prisma.cableConnector.findMany(),
      prisma.testimonial.findMany({ where: { isActive: true } }),
      prisma.pageContent.findMany(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        services,
        products,
        cableTypes,
        cableConnectors,
        testimonials,
        pageContents,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
