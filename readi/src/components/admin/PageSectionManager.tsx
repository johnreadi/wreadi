"use client";

import { useState } from "react";
import {
    Plus, Edit, Trash2, Image as ImageIcon, Video, Layers,
    ChevronUp, ChevronDown, Check, Save, X, Layout, Move,
    Settings2, Play, LayoutGrid, Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    addPageSection, updatePageSection, deletePageSection, reorderSections
} from "@/app/admin/content/page-actions";

type Section = {
    id: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    order: number;
    isActive: boolean;
    mediaType: "IMAGE" | "VIDEO" | "SLIDESHOW";
    mediaUrl: string | null;
    slides: string | null;
    layout: "LEFT" | "RIGHT" | "CENTER" | "FULL";
    animation: string | null;
    ctaText: string | null;
    ctaLink: string | null;
    titleFontSize: string | null;
    titleFontFamily: string | null;
    contentFontSize: string | null;
    backgroundColor: string | null;
};

interface PageSectionManagerProps {
    pageSlug: string;
    initialSections: any[];
}

export function PageSectionManager({ pageSlug, initialSections }: PageSectionManagerProps) {
    const [sections, setSections] = useState<Section[]>(initialSections as Section[]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const handleAddSection = async (formData: FormData) => {
        try {
            formData.append("order", sections.length.toString());
            // Default isActive to true for new sections if not provided (though we will enable the checkbox)
            if (!formData.has("isActive")) {
                formData.append("isActive", "on");
            }
            await addPageSection(pageSlug, formData);
            setIsAddOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error adding section:", error);
            alert("Une erreur est survenue lors de l'ajout de la section. Veuillez réessayer.");
        }
    };

    const handleUpdateSection = async (id: string, formData: FormData) => {
        try {
            await updatePageSection(id, formData);
            setEditingSection(null);
            window.location.reload();
        } catch (error) {
            console.error("Error updating section:", error);
            alert("Une erreur est survenue lors de la modification de la section. Veuillez réessayer.");
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (confirm("Supprimer cette section ?")) {
            await deletePageSection(id);
            window.location.reload();
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSections.length) return;

        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        await reorderSections(newSections.map(s => s.id));
        setSections(newSections);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutGrid className="h-6 w-6 text-red-600" />
                        Sections de la page
                    </h2>
                    <p className="text-gray-500 text-sm">Organisez les blocs de contenu, images, vidéos et sliders.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une section
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                        <form action={handleAddSection} className="flex flex-col h-full min-h-0 gap-4">
                            <DialogHeader>
                                <DialogTitle>Nouvelle section</DialogTitle>
                                <DialogDescription>Créez un bloc riche pour votre front-end.</DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <SectionFormFields />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Créer la section</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {sections.sort((a, b) => a.order - b.order).map((section, index) => (
                    <Card key={section.id} className="group hover:border-red-200 transition-all">
                        <CardHeader className="py-4 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6"
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6"
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={index === sections.length - 1}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{section.title || "Section sans titre"}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] uppercase">
                                                {section.mediaType === "IMAGE" && <ImageIcon className="h-3 w-3 mr-1" />}
                                                {section.mediaType === "VIDEO" && <Play className="h-3 w-3 mr-1" />}
                                                {section.mediaType === "SLIDESHOW" && <Layers className="h-3 w-3 mr-1" />}
                                                {section.mediaType}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] uppercase">
                                                {section.layout}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingSection(section)}>
                                        <Edit className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="py-4">
                            <p className="text-sm text-gray-600 line-clamp-2 italic">
                                {section.content || "Aucun contenu textuel."}
                            </p>
                            {section.mediaUrl && (
                                <div className="mt-4 p-2 bg-gray-100 rounded text-[10px] text-gray-400 font-mono truncate">
                                    Source: {section.mediaUrl}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {editingSection && (
                <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                        <form action={(fd) => handleUpdateSection(editingSection.id, fd)} className="flex flex-col h-full min-h-0 gap-4">
                            <DialogHeader>
                                <DialogTitle>Modifier la section</DialogTitle>
                                <DialogDescription>Ajustez les textes et médias du bloc.</DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <SectionFormFields key={editingSection.id} section={editingSection} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Enregistrer les modifications</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

function SectionFormFields({ section }: { section?: Section }) {
    const [mType, setMType] = useState(section?.mediaType || "IMAGE");
    const [mediaInputType, setMediaInputType] = useState<"file" | "url">(
        section?.mediaUrl?.startsWith("http") ? "url" : "file"
    );

    return (
        <div className="grid gap-6 py-6">
            <input type="hidden" name="mediaInputType" value={mediaInputType} />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Titre principal</Label>
                    <Input id="title" name="title" defaultValue={section?.title || ""} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subtitle">Sous-titre</Label>
                    <Input id="subtitle" name="subtitle" defaultValue={section?.subtitle || ""} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Contenu (Texte descriptif)</Label>
                <Textarea id="content" name="content" defaultValue={section?.content || ""} rows={3} />
            </div>

            <div className="grid grid-cols-3 gap-4 border p-4 rounded-xl bg-gray-50/30">
                <div className="space-y-2">
                    <Label>Média</Label>
                    <Select name="mediaType" defaultValue={mType} onValueChange={(v: any) => setMType(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IMAGE">Image simple</SelectItem>
                            <SelectItem value="VIDEO">Vidéo (Youtube/Vimeo)</SelectItem>
                            <SelectItem value="SLIDESHOW">Diaporama (Slides)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 col-span-2">
                    <Label className="flex items-center gap-2">
                        {mType === 'VIDEO' ? 'Source de la vidéo' : 'Source de l\'image'}
                    </Label>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    id="media-type-file" 
                                    checked={mediaInputType === "file"} 
                                    onChange={() => setMediaInputType("file")}
                                    className="w-3 h-3 text-red-600 focus:ring-red-500"
                                />
                                <Label htmlFor="media-type-file" className="font-normal cursor-pointer text-xs">Fichier Local</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="radio" 
                                    id="media-type-url" 
                                    checked={mediaInputType === "url"} 
                                    onChange={() => setMediaInputType("url")}
                                    className="w-3 h-3 text-red-600 focus:ring-red-500"
                                />
                                <Label htmlFor="media-type-url" className="font-normal cursor-pointer text-xs">URL Externe</Label>
                            </div>
                        </div>

                        {mediaInputType === "url" ? (
                            <div className="space-y-1.5">
                                <Input id="mediaUrl" name="mediaUrl" defaultValue={section?.mediaUrl || ""} placeholder="https://..." />
                            </div>
                        ) : (
                            (mType === 'IMAGE' || mType === 'VIDEO' || mType === 'SLIDESHOW') && (
                                <div className="space-y-1.5">
                                    {section?.mediaUrl && mType !== 'SLIDESHOW' && <input type="hidden" name="mediaUrl" value={section.mediaUrl} />}
                                    {section?.slides && mType === 'SLIDESHOW' && <input type="hidden" name="slides" value={section.slides} />}
                                    
                                    <Input 
                                        type="file" 
                                        id="file" 
                                        name={mType === 'SLIDESHOW' ? "files" : "file"}
                                        multiple={mType === 'SLIDESHOW'}
                                        accept={mType === 'VIDEO' ? "video/*" : "image/*"} 
                                        onChange={(e) => {
                                            if (mType === 'SLIDESHOW') {
                                                const files = Array.from(e.target.files || []);
                                                const totalSize = files.reduce((acc, file) => acc + file.size, 0);
                                                if (totalSize > 50 * 1024 * 1024) { // 50MB total limit for slideshow
                                                    alert("La taille totale des fichiers est trop volumineuse (max 50MB).");
                                                    e.target.value = "";
                                                }
                                            } else {
                                                const file = e.target.files?.[0];
                                                if (file && file.size > 20 * 1024 * 1024) { // 20MB limit
                                                    alert("Le fichier est trop volumineux (max 20MB).");
                                                    e.target.value = "";
                                                }
                                            }
                                        }}
                                        className="cursor-pointer file:cursor-pointer file:text-red-600 file:border-0 file:bg-red-50 file:px-4 file:py-1 file:mr-4 file:rounded-full hover:file:bg-red-100 transition-all h-auto py-2" 
                                    />
                                    {mType === 'SLIDESHOW' && section?.slides && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            {JSON.parse(section.slides).length} image(s) actuellement dans le diaporama.
                                            Les nouveaux fichiers remplaceront les existants.
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t pt-6">
                <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-blue-600 font-bold">
                        <Settings2 className="h-4 w-4" />
                        Typographie Titre
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select name="titleFontFamily" defaultValue={section?.titleFontFamily || "inherit"}>
                            <SelectTrigger className="text-xs h-9">
                                <SelectValue placeholder="Police" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inherit">Par défaut</SelectItem>
                                <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                                <SelectItem value="'Outfit', sans-serif">Outfit</SelectItem>
                                <SelectItem value="serif">Serif</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input name="titleFontSize" defaultValue={section?.titleFontSize || "2.25rem"} placeholder="Taille (ex: 2rem)" className="h-9 text-xs" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-green-600 font-bold">
                        <Layout className="h-4 w-4" />
                        Typographie Contenu
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input name="contentFontSize" defaultValue={section?.contentFontSize || "1.125rem"} placeholder="Taille (ex: 1rem)" className="h-9 text-xs" />
                        <span className="text-[10px] text-gray-400">Taille du texte descriptif</span>
                    </div>
                </div>
                
                <div className="space-y-4 col-span-2 border-t pt-4">
                    <Label className="flex items-center gap-2 text-gray-700 font-bold">
                        Couleur de fond (Optionnel)
                    </Label>
                    <ColorPicker 
                        name="backgroundColor" 
                        defaultValue={section?.backgroundColor || "#ffffff"} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="space-y-2">
                    <Label>Disposition</Label>
                    <Select name="layout" defaultValue={section?.layout || "LEFT"}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LEFT">Image à gauche</SelectItem>
                            <SelectItem value="RIGHT">Image à droite</SelectItem>
                            <SelectItem value="CENTER">Centré</SelectItem>
                            <SelectItem value="FULL">Plein écran</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Animation</Label>
                    <Select name="animation" defaultValue={section?.animation || "fade"}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fade">Apparition douce</SelectItem>
                            <SelectItem value="slide">Glissement</SelectItem>
                            <SelectItem value="scale">Zoom progressif</SelectItem>
                            <SelectItem value="none">Sans animation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center pt-8">
                    {section && (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="isActive" name="isActive" defaultChecked={section.isActive} className="w-4 h-4 text-red-600 rounded" />
                            <Label htmlFor="isActive">Actif</Label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
