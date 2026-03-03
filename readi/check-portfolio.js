const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking PortfolioItem model...");
        const count = await prisma.portfolioItem.count();
        console.log(`PortfolioItem count: ${count}`);
        console.log("PortfolioItem model exists and is accessible.");
    } catch (e) {
        console.error("Error accessing PortfolioItem:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
