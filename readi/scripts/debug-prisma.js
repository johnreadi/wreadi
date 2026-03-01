const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Prisma Models:", Object.keys(prisma).filter(k => k[0] !== k[0].toUpperCase() && k[0] !== '$' && k[0] !== '_'));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
