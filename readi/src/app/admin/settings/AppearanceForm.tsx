"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Upload, Type, Layout, Image as ImageIcon, Save, Phone, Mail, MapPin, Clock } from "lucide-react";
import { updateAppearance } from "./settings-actions";

type Settings = {
    id: string;
    siteName: string;
    siteSlogan: string | null;
    siteLogo: string | null;
    primaryColor: string;
    fontFamily: string;
    baseFontSize: string;
    contactEmail: string | null;
    contactPhone: string | null;
    contactAddress: string | null;
    contactHours: string | null;
    contactMapUrl: string | null;
    privacyPolicy: string | null;
    termsOfService: string | null;
};

export function AppearanceForm({ initialSettings }: { initialSettings: Settings | any }) {
    const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings?.siteLogo || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="border-2 border-orange-100 shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="bg-orange-50/50 p-6">
                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase text-gray-900">
                        <Palette className="h-6 w-6 text-orange-600" />
                        Identité & Apparence du Site
                    </CardTitle>
                    <CardDescription className="font-medium">
                        Personnalisez l'image de marque (Logo, Titre) et le style visuel de votre site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={updateAppearance} className="space-y-10">
                        <div className="grid gap-10 md:grid-cols-2">
                            {/* Logo Upload Section */}
                            <div className="space-y-6">
                                <Label className="text-sm font-black uppercase text-gray-400 tracking-widest">Logo de l'entreprise</Label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 hover:border-orange-300 transition-all bg-gray-50/50 group">
                                    {logoPreview ? (
                                        <div className="relative group mb-6">
                                            <img src={logoPreview} alt="Logo preview" className="max-h-32 object-contain group-hover:scale-105 transition-transform" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="text-white hover:bg-white/20 font-bold"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Changer le logo
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 mb-6 text-gray-400">
                                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center">
                                                <ImageIcon className="h-10 w-10 opacity-20" />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-tighter">Aucun logo configuré</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="logo"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white border-2 rounded-2xl font-bold shadow-sm"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choisir un fichier
                                    </Button>
                                </div>
                            </div>

                            {/* General Title Info */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label htmlFor="siteName" className="text-sm font-black uppercase text-gray-400 tracking-widest">Titre du site (SEO)</Label>
                                    <Input
                                        id="siteName"
                                        name="siteName"
                                        defaultValue={initialSettings?.siteName || "READI.FR"}
                                        placeholder="ex: READI Informatique"
                                        className="h-14 border-2 rounded-2xl font-black text-lg focus:border-orange-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="siteSlogan" className="text-sm font-black uppercase text-gray-400 tracking-widest">Slogan ou Accroche</Label>
                                    <Input
                                        id="siteSlogan"
                                        name="siteSlogan"
                                        defaultValue={initialSettings?.siteSlogan || ""}
                                        placeholder="Ex: La Compétence depuis 1994"
                                        className="h-14 border-2 rounded-2xl font-medium focus:border-orange-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Couleur</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                id="primaryColor"
                                                name="primaryColor"
                                                defaultValue={initialSettings?.primaryColor || "#dc2626"}
                                                className="w-12 h-12 p-1 cursor-pointer border-2 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Typographie</Label>
                                        <select
                                            id="fontFamily"
                                            name="fontFamily"
                                            className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                                            defaultValue={initialSettings?.fontFamily || "Inter"}
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Outfit">Outfit</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Montserrat">Montserrat</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Taille de base</Label>
                                        <select
                                            id="baseFontSize"
                                            name="baseFontSize"
                                            className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                                            defaultValue={initialSettings?.baseFontSize || "16px"}
                                        >
                                            <option value="14px">14px</option>
                                            <option value="16px">16px</option>
                                            <option value="18px">18px</option>
                                            <option value="20px">20px</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="pt-10 border-t-2 border-orange-50 space-y-8">
                            <div>
                                <h3 className="text-xl font-black uppercase text-gray-900 tracking-tight">Coordonnées de Contact</h3>
                                <p className="text-sm text-gray-500 font-medium">Ces informations seront affichées sur la page contact et dans le pied de page.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <Phone className="h-4 w-4 text-red-600" /> Téléphone
                                    </Label>
                                    <Input name="contactPhone" defaultValue={initialSettings?.contactPhone || ""} placeholder="02.35.62.40.46" className="h-12 border-2 rounded-xl font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <Mail className="h-4 w-4 text-red-600" /> Email public
                                    </Label>
                                    <Input name="contactEmail" defaultValue={initialSettings?.contactEmail || ""} placeholder="contact@readi.fr" className="h-12 border-2 rounded-xl font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <Clock className="h-4 w-4 text-red-600" /> Horaires (ex: Lun-Ven, 9h-18h)
                                    </Label>
                                    <Input name="contactHours" defaultValue={initialSettings?.contactHours || ""} placeholder="Lundi - Vendredi / 9h00 - 18h00" className="h-12 border-2 rounded-xl font-bold" />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <MapPin className="h-4 w-4 text-red-600" /> Adresse Postale
                                    </Label>
                                    <Textarea name="contactAddress" defaultValue={initialSettings?.contactAddress || ""} placeholder="123 Rue de l'Informatique, 76000 Rouen" className="border-2 rounded-xl font-medium" rows={2} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <ImageIcon className="h-4 w-4 text-red-600" /> Image de la carte (URL)
                                    </Label>
                                    <Input name="contactMapUrl" defaultValue={initialSettings?.contactMapUrl || ""} placeholder="https://..." className="h-12 border-2 rounded-xl text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Legal / Policies Section */}
                        <div className="pt-10 border-t-2 border-orange-50 space-y-8">
                            <div>
                                <h3 className="text-xl font-black uppercase text-gray-900 tracking-tight">Mentions Légales & Confidentialité</h3>
                                <p className="text-sm text-gray-500 font-medium">Contenu qui s'affichera au format fenêtre modale depuis les liens du bas de page.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <Layout className="h-4 w-4 text-orange-600" /> Politique de confidentialité
                                    </Label>
                                    <Textarea name="privacyPolicy" defaultValue={initialSettings?.privacyPolicy || "La sécurité et la protection de vos données sont notre priorité. Ce site ne collecte que les informations nécessaires au bon traitement de vos demandes ou à la facturation (Nom, Prénom, Email, Téléphone, Adresse de votre entreprise).\n\nConformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement de ces données."} placeholder="Insérez ici la politique de confidentialité..." className="border-2 rounded-xl font-medium min-h-[150px]" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 tracking-widest">
                                        <Type className="h-4 w-4 text-orange-600" /> Conditions Générales (CGU)
                                    </Label>
                                    <Textarea name="termsOfService" defaultValue={initialSettings?.termsOfService || "L'utilisation de ce site web implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après.\n\nCe site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par l'éditeur.\n\nToute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site informatique et matériel, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable."} placeholder="Insérez ici les conditions générales..." className="border-2 rounded-xl font-medium min-h-[150px]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 h-16 px-16 rounded-[2rem] text-xl font-black shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95">
                                <Save className="mr-3 h-6 w-6" />
                                Publier l'image de marque
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
