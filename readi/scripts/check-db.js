const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- SiteSettings ---");
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    console.log(JSON.stringify(settings, null, 2));

    console.log("\n--- PageContent (home) ---");
    const home = await prisma.pageContent.findUnique({ where: { pageSlug: "home" } });
    console.log(JSON.stringify(home, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
