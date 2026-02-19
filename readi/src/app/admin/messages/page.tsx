import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactMessage } from "@prisma/client";

async function getMessages(): Promise<ContactMessage[]> {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages de contact</h1>

      <Card>
        <CardHeader>
          <CardTitle>Messages reçus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Sujet</th>
                  <th className="text-left py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message: ContactMessage) => (
                  <tr key={message.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(message.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">{message.name}</td>
                    <td className="py-3 px-4">{message.email}</td>
                    <td className="py-3 px-4">{message.subject}</td>
                    <td className="py-3 px-4">
                      <Badge variant={message.isRead ? "secondary" : "default"}>
                        {message.isRead ? "Lu" : "Non lu"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
