import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteRequest } from "@prisma/client";

async function getQuotes(): Promise<QuoteRequest[]> {
  return prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "default",
  IN_PROGRESS: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Demandes de devis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les demandes</CardTitle>
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
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote: QuoteRequest) => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">{quote.firstName} {quote.lastName}</td>
                    <td className="py-3 px-4">{quote.email}</td>
                    <td className="py-3 px-4">{quote.subject}</td>
                    <td className="py-3 px-4">
                      {quote.configurationType === "cable" ? "Câble" : "Produit"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariants[quote.status] || "default"}>
                        {statusLabels[quote.status] || quote.status}
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
