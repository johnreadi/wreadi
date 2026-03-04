import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactMessage } from "@prisma/client";
import { Mail, Save, Server, Users } from "lucide-react";
import { revalidatePath } from "next/cache";

async function getMessages(): Promise<ContactMessage[]> {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    // Create default settings if not exists (though likely exists from seed or usage)
    settings = await prisma.siteSettings.create({
      data: { id: "default" },
    });
  }
  return settings;
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const settings = await getSettings();

  async function updateMessagingSettings(formData: FormData) {
    "use server";

    const emailSmtpHost = formData.get("emailSmtpHost") as string;
    const emailSmtpPort = parseInt(formData.get("emailSmtpPort") as string || "587");
    const emailSmtpUser = formData.get("emailSmtpUser") as string;
    const emailSmtpPass = formData.get("emailSmtpPass") as string;
    const emailRecipients = formData.get("emailRecipients") as string;
    const emailFrom = formData.get("emailFrom") as string;
    const contactEmail = formData.get("contactEmail") as string;

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        emailSmtpHost,
        emailSmtpPort,
        emailSmtpUser,
        emailSmtpPass,
        emailRecipients,
        emailFrom,
        contactEmail,
      },
    });

    revalidatePath("/admin/messages");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages de contact</h1>

      <div className="grid gap-6">
        {/* Configuration Messagerie */}
        <form action={updateMessagingSettings}>
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-blue-50/50">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Configuration Messagerie
              </CardTitle>
              <CardDescription>
                Configurez les paramètres d'envoi d'emails et les destinataires des formulaires de contact.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* SMTP Host */}
                <div className="space-y-2">
                  <Label htmlFor="emailSmtpHost" className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    Serveur SMTP (Host)
                  </Label>
                  <Input
                    id="emailSmtpHost"
                    name="emailSmtpHost"
                    defaultValue={settings?.emailSmtpHost || ""}
                    placeholder="ex: smtp.office365.com"
                  />
                </div>

                {/* SMTP Port */}
                <div className="space-y-2">
                  <Label htmlFor="emailSmtpPort">Port SMTP</Label>
                  <Input
                    id="emailSmtpPort"
                    name="emailSmtpPort"
                    type="number"
                    defaultValue={settings?.emailSmtpPort || 587}
                    placeholder="587"
                  />
                </div>

                {/* SMTP User */}
                <div className="space-y-2">
                  <Label htmlFor="emailSmtpUser">Utilisateur SMTP</Label>
                  <Input
                    id="emailSmtpUser"
                    name="emailSmtpUser"
                    defaultValue={settings?.emailSmtpUser || ""}
                    placeholder="ex: contact@readi.fr"
                  />
                </div>

                {/* SMTP Pass */}
                <div className="space-y-2">
                  <Label htmlFor="emailSmtpPass">Mot de passe SMTP</Label>
                  <Input
                    id="emailSmtpPass"
                    name="emailSmtpPass"
                    type="password"
                    defaultValue={settings?.emailSmtpPass || ""}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 {/* Email Principal (Modifiable) */}
                 <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-600" />
                    Email Principal (Site)
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    defaultValue={settings?.contactEmail || ""}
                    placeholder="ex: contact@readi.fr"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adresse affichée sur le site et utilisée par défaut.
                  </p>
                </div>

                {/* Destinataires Multiples */}
                <div className="space-y-2">
                  <Label htmlFor="emailRecipients" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Destinataires (séparés par des virgules)
                  </Label>
                  <Input
                    id="emailRecipients"
                    name="emailRecipients"
                    defaultValue={settings?.emailRecipients || ""}
                    placeholder="ex: admin@readi.fr, support@readi.fr"
                  />
                  <p className="text-xs text-muted-foreground">
                    Les messages seront envoyés à ces adresses (en plus de l'email principal si configuré).
                  </p>
                </div>

                {/* Email d'envoi */}
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Adresse d'envoi (From)</Label>
                  <Input
                    id="emailFrom"
                    name="emailFrom"
                    defaultValue={settings?.emailFrom || ""}
                    placeholder="ex: no-reply@readi.fr"
                  />
                  <p className="text-xs text-muted-foreground">
                    L'adresse qui apparaîtra comme expéditeur.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder la configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

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
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Aucun message reçu pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
