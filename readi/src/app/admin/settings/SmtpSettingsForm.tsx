"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Save, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { updateSmtpSettings, testSmtpConfiguration } from "./settings-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Settings = {
    emailSmtpHost?: string | null;
    emailSmtpPort?: number | null;
    emailSmtpUser?: string | null;
    emailSmtpPass?: string | null;
    emailRecipients?: string | null;
    emailFrom?: string | null;
};

type TestResult = {
    success: boolean;
    title: string;
    message: string;
} | null;

export function SmtpSettingsForm({ initialSettings }: { initialSettings: Settings | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<TestResult>(null);
    const [showDialog, setShowDialog] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

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

    const handleTest = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsTesting(true);
        const formData = new FormData(formRef.current);
        
        const settings = {
            host: formData.get("emailSmtpHost") as string,
            port: parseInt(formData.get("emailSmtpPort") as string || "587"),
            user: formData.get("emailSmtpUser") as string,
            pass: formData.get("emailSmtpPass") as string,
            from: formData.get("emailFrom") as string,
            to: (formData.get("emailRecipients") as string || "").split(",")[0]?.trim(),
        };

        if (!settings.host || !settings.user || !settings.pass || !settings.from || !settings.to) {
            toast.error("Veuillez remplir tous les champs (et définir au moins un destinataire) pour tester.");
            setIsTesting(false);
            return;
        }

        // Vérification basique du serveur SMTP (souvent les utilisateurs mettent imap ou pop par erreur)
        if (settings.host.toLowerCase().startsWith("imap.") || settings.host.toLowerCase().startsWith("pop.") || settings.host.toLowerCase().startsWith("mail.")) {
            const suggested = settings.host.replace(/^(imap|pop|mail)\./i, "smtp.");
            setTestResult({
                success: false,
                title: "Serveur SMTP incorrect probable",
                message: `Il semble que vous ayez saisi un serveur de réception (${settings.host}). Pour l'envoi d'emails, le serveur commence généralement par "smtp" (ex: ${suggested}). Veuillez corriger le champ "Hôte SMTP".`
            });
            setShowDialog(true);
            setIsTesting(false);
            return;
        }

        try {
            const result = await testSmtpConfiguration(settings);
            if (result.success) {
                setTestResult({
                    success: true,
                    title: "Test réussi !",
                    message: "La configuration SMTP est correcte. Un email de test a été envoyé à " + settings.to
                });
            } else {
                setTestResult({
                    success: false,
                    title: "Échec du test",
                    message: result.error || "Impossible de se connecter au serveur SMTP."
                });
            }
            setShowDialog(true);
        } catch (error: any) {
            setTestResult({
                success: false,
                title: "Erreur inattendue",
                message: error.message || "Une erreur est survenue lors du test."
            });
            setShowDialog(true);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <>
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
                    <form ref={formRef} action={handleSubmit} className="space-y-6">
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

                        <div className="flex justify-end pt-4 gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleTest} 
                                disabled={isTesting || isSubmitting}
                                className="font-bold rounded-xl px-6 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                {isTesting ? (
                                    <>Test en cours...</>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Test Messagerie
                                    </>
                                )}
                            </Button>
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

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className={testResult?.success ? "text-green-600 flex items-center gap-2" : "text-red-600 flex items-center gap-2"}>
                            {testResult?.success ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                            {testResult?.title}
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-base text-gray-700">
                            {testResult?.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
