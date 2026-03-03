import { prisma } from "@/lib/prisma";
import { PortfolioList } from "@/components/admin/PortfolioList";

async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <div className="container mx-auto py-6">
      <PortfolioList
        initialItems={items}
      />
    </div>
  );
}
