const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding test conversations...");

    const conv = await prisma.conversation.upsert({
        where: { id: "test-conv-1" },
        update: {},
        create: {
            id: "test-conv-1",
            participantName: "Marie Laurent",
            participantEmail: "m.laurent@agence.com",
            subject: "Demande de maintenance",
            status: "OPEN",
            lastMessageAt: new Date(),
            messages: {
                create: [
                    {
                        id: "msg-1",
                        content: "La maintenance est-elle comprise dans le contrat ?",
                        senderType: "USER",
                        createdAt: new Date(Date.now() - 3600000), // 1h ago
                    },
                    {
                        id: "msg-2",
                        content: "Bonjour Marie, oui la maintenance préventive est incluse.",
                        senderType: "ADMIN",
                        createdAt: new Date(Date.now() - 1800000), // 30min ago
                    }
                ]
            }
        }
    });

    const conv2 = await prisma.conversation.upsert({
        where: { id: "test-conv-2" },
        update: {},
        create: {
            id: "test-conv-2",
            participantName: "Jean Dupont",
            participantEmail: "j.dupont@exemple.fr",
            subject: "Devis Affichage Dynamique",
            status: "OPEN",
            lastMessageAt: new Date(),
            messages: {
                create: [
                    {
                        id: "msg-3",
                        content: "Pouvez-vous m'envoyer un devis pour l'affichage dynamique ?",
                        senderType: "USER",
                        createdAt: new Date(Date.now() - 7200000), // 2h ago
                    }
                ]
            }
        }
    });

    console.log("Seeding successful!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
