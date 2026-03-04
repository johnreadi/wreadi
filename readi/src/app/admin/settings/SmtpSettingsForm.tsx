"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { updateSmtpSettings } from "./settings-actions";

type Settings = {
    emailSmtpHost?: string | null;
    emailSmtpPort?: number | null;
    emailSmtpUser?: string | null;
    emailSmtpPass?: string | null;
    emailRecipients?: string | null;
    emailFrom?: string | null;
};

export function SmtpSettingsForm({ initialSettings }: { initialSettings: Settings | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await updateSmtpSettings(formData);
            toast.success("Configuration SMTP mise à jour avec succès !");
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour:", error);
            toast.error(error.message || "Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-2 border-blue-100 shadow-lg rounded-3xl overflow-hidden mt-8">
            <CardHeader className="bg-blue-50/50 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase text-gray-900">
                    <Mail className="h-6 w-6 text-blue-600" />
                    Configuration Email (SMTP)
                </CardTitle>
                <CardDescription className="font-medium">
                    Configurez le serveur d'envoi d'emails pour les notifications et les messages de contact.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <form action={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emailSmtpHost">Hôte SMTP (Host)</Label>
                            <Input 
                                id="emailSmtpHost" 
                                name="emailSmtpHost" 
                                defaultValue={initialSettings?.emailSmtpHost || ""} 
                                placeholder="smtp.gmail.com" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailSmtpPort">Port SMTP</Label>
                            <Input 
                                id="emailSmtpPort" 
                                name="emailSmtpPort" 
                                type="number" 
                                defaultValue={initialSettings?.emailSmtpPort || 587} 
                                placeholder="587" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailSmtpUser">Utilisateur SMTP (User)</Label>
                            <Input 
                                id="emailSmtpUser" 
                                name="emailSmtpUser" 
                                defaultValue={initialSettings?.emailSmtpUser || ""} 
                                placeholder="mon-email@gmail.com" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailSmtpPass">Mot de passe SMTP</Label>
                            <Input 
                                id="emailSmtpPass" 
                                name="emailSmtpPass" 
                                type="password" 
                                defaultValue={initialSettings?.emailSmtpPass || ""} 
                                placeholder="••••••••" 
                            />
                            <p className="text-xs text-gray-500">Pour Gmail, utilisez un "Mot de passe d'application".</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label htmlFor="emailFrom">Adresse d'expédition (From)</Label>
                            <Input 
                                id="emailFrom" 
                                name="emailFrom" 
                                defaultValue={initialSettings?.emailFrom || ""} 
                                placeholder="no-reply@monsite.com" 
                            />
                            <p className="text-xs text-gray-500">L'adresse qui apparaîtra comme expéditeur.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailRecipients">Destinataires (Admin)</Label>
                            <Input 
                                id="emailRecipients" 
                                name="emailRecipients" 
                                defaultValue={initialSettings?.emailRecipients || ""} 
                                placeholder="admin@monsite.com, support@monsite.com" 
                            />
                            <p className="text-xs text-gray-500">Adresses email séparées par des virgules pour recevoir les messages de contact.</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8">
                            {isSubmitting ? "Sauvegarde..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Enregistrer la configuration
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
