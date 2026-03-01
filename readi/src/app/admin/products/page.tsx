import { prisma } from "@/lib/prisma";
import { ProductList } from "@/components/admin/ProductList";

async function getProducts() {
  return prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto py-6">
      <ProductList
        initialProducts={products as any}
        categories={categories}
      />
    </div>
  );
}
