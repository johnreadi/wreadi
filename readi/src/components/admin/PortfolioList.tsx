"use client";

import { useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    Image as ImageIcon,
    LayoutGrid,
    AlertTriangle
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    togglePortfolioItemStatus
} from "@/app/admin/content/portfolio/portfolio-actions";

interface PortfolioItem {
    id: string;
    title: string;
    description: string | null;
    image: string;
    category: string;
    isActive: boolean;
}

interface PortfolioListProps {
    initialItems: PortfolioItem[];
}

const CATEGORIES = [
    { value: "affichage-dynamique", label: "Affichage Dynamique" },
    { value: "holographique", label: "Holographique 3D" },
    { value: "borne-tactile", label: "Borne Tactile" },
    { value: "site-internet", label: "Site Internet" },
    { value: "maintenance", label: "Maintenance Informatique" },
    { value: "installation", label: "Installation Réseau" },
];

export function PortfolioList({ initialItems }: PortfolioListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

    const handleEdit = (item: PortfolioItem) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const handleDelete = (item: PortfolioItem) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <LayoutGrid className="h-8 w-8 text-blue-600" />
                    Gestion du Portfolio
                </h1>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une réalisation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] flex flex-col">
                        <form action={async (formData) => {
                            await createPortfolioItem(formData);
                            setIsAddOpen(false);
                        }} className="flex flex-col h-full min-h-0">
                            <DialogHeader>
                                <DialogTitle>Ajouter une réalisation</DialogTitle>
                                <DialogDescription>
                                    Ajoutez un nouveau projet à votre portfolio.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre du projet</Label>
                                    <Input id="title" name="title" placeholder="ex: Installation Écran LED" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Catégorie</Label>
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="imageFile">Image de la réalisation</Label>
                                    <Input type="file" id="imageFile" name="imageFile" accept="image/*" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" rows={4} placeholder="Détails du projet..." />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Visible sur le site</Label>
                                    <Switch id="isActive" name="isActive" defaultChecked />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600">Ajouter au portfolio</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialItems.length === 0 ? (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                Aucun projet dans le portfolio.
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    initialItems.map((item) => (
                        <Card key={item.id} className="hover:border-blue-200 transition-colors overflow-hidden group">
                            <div className="aspect-video relative bg-gray-100 overflow-hidden">
                                {item.image ? (
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant={item.isActive ? "default" : "secondary"} className={item.isActive ? "bg-green-500" : ""}>
                                        {item.isActive ? "Visible" : "Caché"}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                                            {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                                        </Badge>
                                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                                    {item.description || "Aucune description"}
                                </p>
                                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                                    <button
                                        onClick={() => togglePortfolioItemStatus(item.id, item.isActive)}
                                        className="text-xs text-gray-500 hover:text-blue-600 underline mr-auto"
                                    >
                                        {item.isActive ? "Masquer" : "Publier"}
                                    </button>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                        <Edit3 className="h-4 w-4 mr-1" /> Modifier
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] flex flex-col">
                    {selectedItem && (
                        <form action={async (formData) => {
                            await updatePortfolioItem(selectedItem.id, formData);
                            setIsEditOpen(false);
                        }} className="flex flex-col h-full min-h-0">
                            <DialogHeader>
                                <DialogTitle>Modifier le projet</DialogTitle>
                                <DialogDescription>
                                    Mise à jour des informations pour {selectedItem.title}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title">Titre du projet</Label>
                                    <Input id="edit-title" name="title" defaultValue={selectedItem.title} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Catégorie</Label>
                                    <Select name="category" defaultValue={selectedItem.category}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-imageFile">Image de la réalisation</Label>
                                    {selectedItem.image && (
                                        <div className="text-xs text-gray-500 truncate mb-1" title={selectedItem.image}>
                                            Actuel: {selectedItem.image.split("/").pop()}
                                        </div>
                                    )}
                                    <Input type="hidden" name="image" value={selectedItem.image || ""} />
                                    <Input type="file" id="edit-imageFile" name="imageFile" accept="image/*" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea id="edit-description" name="description" rows={4} defaultValue={selectedItem.description || ""} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="edit-isActive">Visible sur le site</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedItem.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600">Enregistrer les modifications</Button>
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
                            Êtes-vous sûr de vouloir supprimer ce projet du portfolio ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedItem) {
                                    await deletePortfolioItem(selectedItem.id);
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
