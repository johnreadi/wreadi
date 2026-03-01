"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, User, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SecurityForms() {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation de sauvegarde
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-red-600" />
                Sécurité & Profil
            </h1>

            {isSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <AlertTitle>Succès !</AlertTitle>
                    <AlertDescription>
                        Vos paramètres ont été mis à jour avec succès.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Changement de mot de passe */}
                <Card className="border-2 border-red-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-red-600" />
                            Changer le mot de passe
                        </CardTitle>
                        <CardDescription>
                            Nous vous recommandons de changer votre mot de passe régulièrement pour sécuriser l'accès admin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="old-password">Mot de passe actuel</Label>
                                <Input id="old-password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                <Input id="new-password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                                Mettre à jour le mot de passe
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Profil Administrateur */}
                <Card className="border-2 border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            Information de l'administrateur
                        </CardTitle>
                        <CardDescription>
                            Modifiez vos informations de contact et d'affichage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="admin-name">Nom complet</Label>
                                <Input id="admin-name" defaultValue="Administrateur READI" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-email">Email professionnel</Label>
                                <Input id="admin-email" type="email" defaultValue="admin@readi.fr" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-role">Rôle</Label>
                                <Input id="admin-role" value="SUPER_ADMIN" disabled className="bg-gray-50 mt-1" />
                            </div>
                            <Button type="submit" variant="outline" className="w-full">
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer le profil
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                    Gardez vos accès confidentiels. Ne partagez jamais votre mot de passe administrateur.
                </AlertDescription>
            </Alert>
        </div>
    );
}
