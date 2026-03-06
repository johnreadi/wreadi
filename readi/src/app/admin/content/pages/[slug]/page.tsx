import { prisma } from "@/lib/prisma";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { PageSectionManager } from "@/components/admin/PageSectionManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Layout, ArrowLeft, Image as ImageIcon, Video, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { upsertPageContent } from "@/app/admin/content/page-actions";
import { handleFileUpload } from "@/lib/file-upload";
import { HeroActiveToggle } from "@/components/admin/HeroActiveToggle";

async function getPageData(slug: string) {
    // @ts-ignore - Prisma types might be out of sync in IDE
    const page = await prisma.pageContent.findUnique({
        where: { pageSlug: slug },
        include: {
            sections: {
                orderBy: { order: "asc" },
            },
        },
    });
    return page;
}

const DEFAULT_PAGE_DATA: Record<string, any> = {
    "home": {
        heroTitle: "SERVICE DU PRO...",
        heroSubtitle: "Pro depuis 1994",
        heroDescription: "READI.FR c'est : La Compétence !",
        heroBtnText: "Demander un devis",
        heroBtnLink: "/contact",
    },
    "affichage-dynamique": {
        heroTitle: "Affichage Dynamique",
        heroSubtitle: "Innovation Visuelle",
        heroDescription: "Solutions d'affichage moderne et holographique pour votre entreprise",
        heroBtnText: "Demander un devis",
        heroBtnLink: "/contact",
    },
    "informatique-maintenance": {
        heroTitle: "Maintenance & Installation",
        heroSubtitle: "Service Pro sur site",
        heroDescription: "Dépannage informatique, installation réseau et maintenance de parcs professionnels.",
        heroBtnText: "Demander une intervention",
        heroBtnLink: "/contact",
    },
    "pieces-detachees": {
        heroTitle: "Pièces Détachées & Catalogues",
        heroSubtitle: "Solutions Composants",
        heroDescription: "Trouvez vos composants via notre configurateur ou nos portails partenaires officiels.",
        heroBtnText: "Accéder au catalogue",
        heroBtnLink: "#catalogues",
    },
    "contact": {
        heroTitle: "Contactez-nous",
        heroSubtitle: "Innovation & Proximité",
        heroDescription: "Une question ? Un projet ? Nous sommes là pour vous aider.",
        heroBtnText: "Envoyez-nous un message",
        heroBtnLink: "Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
    },
};

export default async function PageEditor({ params }: { params: { slug: string } }) {
    const page = await getPageData(params.slug);
    const defaults = DEFAULT_PAGE_DATA[params.slug] || {};

    const pageData = {
        heroTitle: page?.heroTitle || defaults.heroTitle || "",
        heroSubtitle: page?.heroSubtitle || defaults.heroSubtitle || "",
        heroDescription: page?.heroDescription || defaults.heroDescription || "",
        heroBtnText: page?.heroBtnText || defaults.heroBtnText || "",
        heroBtnLink: page?.heroBtnLink || defaults.heroBtnLink || "",
        heroImage: page?.heroImage || "",
        heroVideoUrl: page?.heroVideoUrl || "",
        heroBgColor: page?.heroBgColor || "",
        heroActive: page?.heroActive ?? true,
        // Font settings
        titleFontSize: page?.titleFontSize || "4rem",
        titleFontFamily: page?.titleFontFamily || "inherit",
        subtitleFontSize: page?.subtitleFontSize || "1.25rem",
        descriptionFontSize: page?.descriptionFontSize || "1.125rem",
    };

    async function handleSaveHero(formData: FormData) {
        "use server";
        
        // Handle file uploads
        const imageFile = formData.get("heroImageFile") as File;
        const videoFile = formData.get("heroVideoFile") as File;
        
        let heroImage = formData.get("heroImage") as string;
        let heroVideoUrl = formData.get("heroVideoUrl") as string;

        const uploadedImage = await handleFileUpload(imageFile);
        if (uploadedImage) {
            heroImage = uploadedImage;
        }

        const uploadedVideo = await handleFileUpload(videoFile);
        if (uploadedVideo) {
            heroVideoUrl = uploadedVideo;
        }

        const data = {
            heroTitle: formData.get("heroTitle") as string,
            heroSubtitle: formData.get("heroSubtitle") as string,
            heroDescription: formData.get("heroDescription") as string,
            heroBtnText: formData.get("heroBtnText") as string,
            heroBtnLink: formData.get("heroBtnLink") as string,
            heroImage,
            heroVideoUrl,
            heroBgColor: (formData.get("heroBgColorText") as string) || (formData.get("heroBgColor") as string),
            heroActive: formData.get("heroActive") === "on",
            // Font fields
            titleFontSize: formData.get("titleFontSize") as string,
            titleFontFamily: formData.get("titleFontFamily") as string,
            subtitleFontSize: formData.get("subtitleFontSize") as string,
            descriptionFontSize: formData.get("descriptionFontSize") as string,
        };
        await upsertPageContent(params.slug, data);
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="rounded-full">
                        <Link href="/admin/content/pages">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
                        Page : <span className="text-red-600">{params.slug.replace("-", " ")}</span>
                    </h1>
                </div>
                <Button asChild variant="ghost" className="text-red-600 hover:text-red-700 font-bold gap-2">
                    <Link href={params.slug === 'home' ? '/' : `/${params.slug}`} target="_blank">
                        <Eye className="h-5 w-5" />
                        Voir la page en direct
                    </Link>
                </Button>
            </div>

            <Card className="border-2 border-red-100 shadow-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-red-50/50 p-8 border-b border-red-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-2xl font-black text-gray-900">
                                <Layout className="h-6 w-6 text-red-600" />
                                {params.slug === 'contact' ? 'Configuration Textes Formulaire & Bannière' : 'Section Héro (Bannière Principale)'}
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-500 font-medium">
                                {params.slug === 'contact' ? 'Modifiez ici les titres de la page et les instructions du formulaire contact.' : "Configurez le visuel et la typographie d'accueil."}
                            </CardDescription>
                        </div>
                        <HeroActiveToggle defaultChecked={pageData.heroActive} name="heroActive" />
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={handleSaveHero} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Text Content Context */}
                            <div className="space-y-8">
                                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                    <Label htmlFor="heroTitle" className="text-xs font-black uppercase text-gray-400 tracking-wider">Titre Principal Héro</Label>
                                    <Textarea id="heroTitle" name="heroTitle" defaultValue={pageData.heroTitle} rows={2} className="text-2xl font-bold border-2" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-gray-400">Police :</Label>
                                            <Select name="titleFontFamily" defaultValue={pageData.titleFontFamily}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="inherit">Défaut du site</SelectItem>
                                                    <SelectItem value="'Inter', sans-serif">Inter (Moderne)</SelectItem>
                                                    <SelectItem value="'Outfit', sans-serif">Outfit (Premium)</SelectItem>
                                                    <SelectItem value="serif">Serif (Classique)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-gray-400">Taille :</Label>
                                            <Input name="titleFontSize" defaultValue={pageData.titleFontSize} className="h-10 border-2 text-sm" placeholder="ex: 4.5rem" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                        <Label htmlFor="heroSubtitle" className="text-xs font-black uppercase text-gray-400 tracking-wider">Sous-titre / Badge</Label>
                                        <Input id="heroSubtitle" name="heroSubtitle" defaultValue={pageData.heroSubtitle} className="h-12 border-2 font-bold" />
                                        <div className="flex items-center gap-4">
                                            <Label className="text-[10px] font-black uppercase text-gray-400 whitespace-nowrap">Taille :</Label>
                                            <Input name="subtitleFontSize" defaultValue={pageData.subtitleFontSize} className="h-10 w-24 border-2 text-sm" placeholder="0.8rem" />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                        <Label htmlFor="heroBtnText" className="text-xs font-black uppercase text-gray-400 tracking-wider">
                                            {params.slug === 'contact' ? 'Titre Formulaire' : "Bouton d'action"}
                                        </Label>
                                        <div className="space-y-2">
                                            <Input id="heroBtnText" name="heroBtnText" defaultValue={pageData.heroBtnText} className="h-12 border-2 text-sm" />
                                            <Label htmlFor="heroBtnLink" className="text-[10px] font-black uppercase text-gray-400">
                                                {params.slug === 'contact' ? 'Description Formulaire :' : "Lien :"}
                                            </Label>
                                            <Input id="heroBtnLink" name="heroBtnLink" defaultValue={pageData.heroBtnLink} className="h-10 border-2 text-xs" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                    <Label htmlFor="heroDescription" className="text-xs font-black uppercase text-gray-400 tracking-wider">Description Héro</Label>
                                    <Textarea id="heroDescription" name="heroDescription" defaultValue={pageData.heroDescription} rows={4} className="text-lg border-2" />
                                    <div className="flex items-center gap-4">
                                        <Label className="text-[10px] font-black uppercase text-gray-400 whitespace-nowrap">Taille de police :</Label>
                                        <Input name="descriptionFontSize" defaultValue={pageData.descriptionFontSize} className="h-10 w-32 border-2 text-sm" placeholder="ex: 1.1rem" />
                                    </div>
                                </div>
                            </div>

                            {/* Media Context */}
                            <div className="space-y-8">
                                <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-2xl text-white space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover:opacity-40">
                                        <ImageIcon className="h-32 w-32 rotate-12" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-red-500 relative z-10">Média & Arrière-plan</h3>

                                    <div className="space-y-6 relative z-10">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Couleur de fond (Optionnel)</Label>
                                            <ColorPicker 
                                                name="heroBgColor" 
                                                defaultValue={pageData.heroBgColor || "#000000"} 
                                                inputClassName="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-lg"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Image de fond</Label>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Input name="heroImage" defaultValue={pageData.heroImage} placeholder="/images/bg.jpg" className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl" />
                                                    <ImageIcon className="absolute left-4 top-4 h-6 w-6 text-red-500" />
                                                </div>
                                                <div className="relative">
                                                    <Input type="file" name="heroImageFile" accept="image/*" className="pl-12 h-14 bg-white/5 border-dashed border-white/20 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" />
                                                    <span className="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase">OU</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Vidéo Youtube / MP4 (Option)</Label>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Input name="heroVideoUrl" defaultValue={pageData.heroVideoUrl} placeholder="Lien vers la vidéo" className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl" />
                                                    <Video className="absolute left-4 top-4 h-6 w-6 text-red-500" />
                                                </div>
                                                <div className="relative">
                                                    <Input type="file" name="heroVideoFile" accept="video/*" className="pl-12 h-14 bg-white/5 border-dashed border-white/20 text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer" />
                                                    <span className="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase">OU</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/10 italic text-white/40 text-sm">
                                        Conseil : Utilisez des images haute résolution (min 1920x1080) pour un rendu premium.
                                    </div>
                                </div>

                                <div className="flex justify-end lg:pt-20">
                                    <Button type="submit" className="bg-red-600 hover:bg-red-700 h-20 px-16 rounded-3xl text-2xl font-black shadow-2xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 group">
                                        <Save className="mr-4 h-8 w-8 transition-transform group-hover:rotate-12" />
                                        Enregistrer les modifications
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Pages sections manager */}
            <div className="pt-10">
                <PageSectionManager
                    pageSlug={params.slug}
                    initialSections={page?.sections || []}
                />
            </div>
        </div>
    );
}
