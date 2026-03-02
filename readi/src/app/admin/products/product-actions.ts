"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/lib/file-upload";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const reference = formData.get("reference") as string || null;
    const description = formData.get("description") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const categoryId = formData.get("categoryId") as string;
    const brand = formData.get("brand") as string;
    const series = formData.get("series") as string;
    const model = formData.get("model") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    let image = formData.get("image") as string;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) image = uploadedImage;

    await prisma.product.create({
        data: {
            name,
            reference,
            description,
            price,
            stock,
            categoryId,
            image,
            brand: brand || null,
            series: series || null,
            model: model || null,
            isActive,
        },
    });

    revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const reference = formData.get("reference") as string || null;
    const description = formData.get("description") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const categoryId = formData.get("categoryId") as string;
    const brand = formData.get("brand") as string;
    const series = formData.get("series") as string;
    const model = formData.get("model") as string;
    const isActive = formData.get("isActive") === "on";

    const imageFile = formData.get("imageFile") as File;
    let image = formData.get("image") as string;

    const uploadedImage = await handleFileUpload(imageFile);
    if (uploadedImage) image = uploadedImage;

    await prisma.product.update({
        where: { id },
        data: {
            name,
            reference,
            description,
            price,
            stock,
            categoryId,
            image,
            brand: brand || null,
            series: series || null,
            model: model || null,
            isActive,
        },
    });

    revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/admin/products");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
    await prisma.product.update({
        where: { id },
        data: {
            isActive: !currentStatus,
        },
    });

    revalidatePath("/admin/products");
}
