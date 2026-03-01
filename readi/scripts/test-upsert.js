const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting upsert for 'home'...");
        const res = await prisma.pageContent.upsert({
            where: { pageSlug: "home" },
            update: { heroTitle: "Test Title" },
            create: { pageSlug: "home", heroTitle: "Test Title" }
        });
        console.log("Success:", res);
    } catch (e) {
        console.error("Error during upsert:", e);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
