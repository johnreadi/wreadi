const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Conversations ---");
    const convs = await prisma.conversation.findMany({
        include: { messages: true }
    });
    console.log(JSON.stringify(convs, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
