"use client";

import { useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    Megaphone,
    Save,
    AlertTriangle,
    ExternalLink,
    Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ColorPicker } from "@/components/admin/ColorPicker";
import {
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    toggleLandingPageStatus
} from "@/app/admin/content/landing-pages/landing-actions";
import Link from "next/link";

interface LandingPage {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    heroTitle: string | null;
    heroSubtitle: string | null;
    heroImage: string | null;
    heroVideo: string | null;
    backgroundColor: string | null;
    isActive: boolean;
    createdAt: Date;
}

interface LandingPageListProps {
    initialLandingPages: LandingPage[];
}

export function LandingPageList({ initialLandingPages }: LandingPageListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
    const [search, setSearch] = useState("");

    const filteredPages = initialLandingPages.filter(page =>
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (page: LandingPage) => {
        setSelectedPage(page);
        setIsEditOpen(true);
    };

    const handleDelete = (page: LandingPage) => {
        setSelectedPage(page);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Megaphone className="h-8 w-8 text-purple-600" />
                    Campagnes Marketing
                </h1>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Rechercher une page..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Créer une page
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                            <form action={async (formData) => {
                                await createLandingPage(formData);
                                setIsAddOpen(false);
                            }} className="flex flex-col h-full min-h-0">
                                <DialogHeader>
                                    <DialogTitle>Nouvelle Campagne Marketing</DialogTitle>
                                    <DialogDescription>
                                        Créez une page d'atterrissage optimisée pour vos publicités.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 flex-1 overflow-y-auto pr-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Nom de la campagne</Label>
                                            <Input id="title" name="title" placeholder="Ex: Promo Hiver 2024" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug URL (optionnel)</Label>
                                            <Input id="slug" name="slug" placeholder="ex: promo-hologramme" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description interne</Label>
                                        <Input id="description" name="description" placeholder="Objectif de la page..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="heroTitle">Titre de la page (Hero)</Label>
                                            <Input id="heroTitle" name="heroTitle" placeholder="Titre accrocheur..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="heroSubtitle">Sous-titre (Hero)</Label>
                                            <Input id="heroSubtitle" name="heroSubtitle" placeholder="Sous-titre..." />
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-t pt-4">
                                        <h3 className="font-semibold text-sm text-gray-900">Apparence Hero</h3>
                                        <div className="space-y-2">
                                            <Label>Couleur de fond</Label>
                                            <ColorPicker name="backgroundColor" defaultValue="#ffffff" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="heroImageFile">Image Hero</Label>
                                                <Input type="file" id="heroImageFile" name="heroImageFile" accept="image/*" className="text-xs" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="heroVideoFile">Vidéo Hero</Label>
                                                <Input type="file" id="heroVideoFile" name="heroVideoFile" accept="video/*" className="text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <Label htmlFor="isActive" className="font-medium text-purple-900">Activer la page</Label>
                                        <Switch id="isActive" name="isActive" defaultChecked />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-purple-600 px-8">Créer la page</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredPages.length === 0 ? (
                    <Card className="border-dashed border-2">
                        <CardContent className="py-12 text-center text-gray-500">
                            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>Aucune page marketing trouvée.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPages.map((page) => (
                        <Card key={page.id} className="hover:border-purple-200 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${page.isActive ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"} rounded-lg flex items-center justify-center`}>
                                        <Megaphone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{page.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <code className="text-xs bg-gray-100 px-1 rounded">/lp/{page.slug}</code>
                                            <span className="text-xs text-gray-400">• Créée le {new Date(page.createdAt).toLocaleDateString("fr-FR")}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleLandingPageStatus(page.id, page.isActive)}
                                        className="focus:outline-none"
                                    >
                                        <Badge variant={page.isActive ? "default" : "secondary"} className="cursor-pointer hover:opacity-80 transition-opacity">
                                            {page.isActive ? "En ligne" : "Désactivée"}
                                        </Badge>
                                    </button>
                                    <Button variant="ghost" size="icon" asChild title="Voir la page">
                                        <Link href={`/lp/${page.slug}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 text-blue-500" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(page)} title="Modifier">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(page)} title="Supprimer">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                    {selectedPage && (
                        <form action={async (formData) => {
                            await updateLandingPage(selectedPage.id, formData);
                            setIsEditOpen(false);
                        }} className="flex flex-col h-full min-h-0">
                            <DialogHeader>
                                <DialogTitle>Modifier la Campagne</DialogTitle>
                                <DialogDescription>
                                    Édition de : {selectedPage.title}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 flex-1 overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-title">Nom de la campagne</Label>
                                        <Input id="edit-title" name="title" defaultValue={selectedPage.title} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-slug">Slug URL</Label>
                                        <Input id="edit-slug" name="slug" defaultValue={selectedPage.slug} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description interne</Label>
                                    <Input id="edit-description" name="description" defaultValue={selectedPage.description || ""} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-heroTitle">Titre de la page (Hero)</Label>
                                            <Input id="edit-heroTitle" name="heroTitle" defaultValue={selectedPage.heroTitle || ""} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-heroSubtitle">Sous-titre (Hero)</Label>
                                            <Input id="edit-heroSubtitle" name="heroSubtitle" defaultValue={selectedPage.heroSubtitle || ""} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-t pt-4">
                                        <h3 className="font-semibold text-sm text-gray-900">Apparence Hero</h3>
                                        <div className="space-y-2">
                                            <Label>Couleur de fond</Label>
                                            <ColorPicker 
                                                name="backgroundColor" 
                                                defaultValue={selectedPage.backgroundColor || "#ffffff"} 
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-heroImageFile">Image Hero</Label>
                                                {selectedPage.heroImage && (
                                                    <div className="text-xs text-gray-500 mb-1 truncate">Actuelle: {selectedPage.heroImage}</div>
                                                )}
                                                <Input type="file" id="edit-heroImageFile" name="heroImageFile" accept="image/*" className="text-xs" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-heroVideoFile">Vidéo Hero</Label>
                                                {selectedPage.heroVideo && (
                                                    <div className="text-xs text-gray-500 mb-1 truncate">Actuelle: {selectedPage.heroVideo}</div>
                                                )}
                                                <Input type="file" id="edit-heroVideoFile" name="heroVideoFile" accept="video/*" className="text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <Label htmlFor="edit-isActive" className="font-medium">Page active</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedPage.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-purple-600 px-8">Mettre à jour</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la page <strong>{selectedPage?.title}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedPage) {
                                    await deleteLandingPage(selectedPage.id);
                                    setIsDeleteOpen(false);
                                }
                            }}
                        >
                            Supprimer définitivement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
