"use client";

import { useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    Monitor,
    Save,
    AlertTriangle,
    LayoutGrid
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
    createService,
    updateService,
    deleteService,
    toggleServiceStatus
} from "@/app/admin/content/services/service-actions";

interface Category {
    id: string;
    name: string;
}

interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDesc: string | null;
    isActive: boolean;
    image: string | null;
    icon: string | null;
    categoryId: string;
    category: {
        name: string;
    };
}

interface ServiceListProps {
    initialServices: Service[];
    categories: Category[];
}

export function ServiceList({ initialServices, categories }: ServiceListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const [imageInputType, setImageInputType] = useState<"file" | "url">("file");
    const [iconInputType, setIconInputType] = useState<"file" | "url">("file");
    const [editImageInputType, setEditImageInputType] = useState<"file" | "url">("file");
    const [editIconInputType, setEditIconInputType] = useState<"file" | "url">("file");

    const handleEdit = (service: Service) => {
        setSelectedService(service);
        setEditImageInputType(service.image?.startsWith("http") ? "url" : "file");
        setEditIconInputType(service.icon?.startsWith("http") ? "url" : "file");
        setIsEditOpen(true);
    };

    const handleDelete = (service: Service) => {
        setSelectedService(service);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Monitor className="h-8 w-8 text-red-600" />
                    Gestion des Services
                </h1>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                        <form action={async (formData) => {
                            await createService(formData);
                            setIsAddOpen(false);
                        }} className="flex flex-col h-full min-h-0">
                            <DialogHeader>
                                <DialogTitle>Ajouter un service</DialogTitle>
                                <DialogDescription>
                                    Décrivez la nouvelle offre de service pour vos clients.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 flex-1 overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom du service</Label>
                                        <Input id="name" name="name" placeholder="ex: Réparation PC" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categoryId">Catégorie</Label>
                                        <Select name="categoryId" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Image du service</Label>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="add-image-file" 
                                                    checked={imageInputType === "file"} 
                                                    onChange={() => setImageInputType("file")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="add-image-file" className="font-normal cursor-pointer">Fichier</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="add-image-url" 
                                                    checked={imageInputType === "url"} 
                                                    onChange={() => setImageInputType("url")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="add-image-url" className="font-normal cursor-pointer">URL</Label>
                                            </div>
                                        </div>
                                        {imageInputType === "file" ? (
                                            <Input type="file" id="imageFile" name="imageFile" accept="image/*" />
                                        ) : (
                                            <Input 
                                                type="url" 
                                                name="imageUrl" 
                                                placeholder="https://exemple.com/image.jpg"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Icône du service</Label>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="add-icon-file" 
                                                    checked={iconInputType === "file"} 
                                                    onChange={() => setIconInputType("file")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="add-icon-file" className="font-normal cursor-pointer">Fichier</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="add-icon-url" 
                                                    checked={iconInputType === "url"} 
                                                    onChange={() => setIconInputType("url")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="add-icon-url" className="font-normal cursor-pointer">URL</Label>
                                            </div>
                                        </div>
                                        {iconInputType === "file" ? (
                                            <Input type="file" id="iconFile" name="iconFile" accept="image/*" />
                                        ) : (
                                            <Input 
                                                type="url" 
                                                name="iconUrl" 
                                                placeholder="https://exemple.com/icone.png"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shortDesc">Description courte (sous-titre)</Label>
                                    <Input id="shortDesc" name="shortDesc" placeholder="Une ligne d'accroche..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description détaillée</Label>
                                    <Textarea id="description" name="description" rows={5} placeholder="Détaillez le service..." required />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <Label htmlFor="isActive" className="font-medium">Activer immédiatement</Label>
                                    <Switch id="isActive" name="isActive" defaultChecked />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-red-600 px-8">Enregistrer le service</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {initialServices.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            Aucun service trouvé.
                        </CardContent>
                    </Card>
                ) : (
                    initialServices.map((service) => (
                        <Card key={service.id} className="hover:border-red-200 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${service.isActive ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"} rounded-lg flex items-center justify-center`}>
                                        <Monitor className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-lg">{service.name}</CardTitle>
                                            <Badge variant="outline" className="text-xs bg-gray-50 flex items-center gap-1">
                                                <LayoutGrid className="h-3 w-3" />
                                                {service.category.name}
                                            </Badge>
                                        </div>
                                        <CardDescription className="line-clamp-1">{service.shortDesc || service.description}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleServiceStatus(service.id, service.isActive)}
                                        className="focus:outline-none"
                                        title={service.isActive ? "Désactiver" : "Activer"}
                                    >
                                        <Badge variant={service.isActive ? "default" : "secondary"} className="cursor-pointer hover:opacity-80 transition-opacity">
                                            {service.isActive ? "Actif" : "Inactif"}
                                        </Badge>
                                    </button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(service)}>
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
                    {selectedService && (
                        <form action={async (formData) => {
                            await updateService(selectedService.id, formData);
                            setIsEditOpen(false);
                        }} className="flex flex-col h-full min-h-0">
                            <DialogHeader>
                                <DialogTitle>Modifier le service</DialogTitle>
                                <DialogDescription>
                                    Mettez à jour les informations de {selectedService.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 flex-1 overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Nom du service</Label>
                                        <Input id="edit-name" name="name" defaultValue={selectedService.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-categoryId">Catégorie</Label>
                                        <Select name="categoryId" defaultValue={selectedService.categoryId} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Image du service</Label>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="edit-image-file" 
                                                    checked={editImageInputType === "file"} 
                                                    onChange={() => setEditImageInputType("file")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="edit-image-file" className="font-normal cursor-pointer">Fichier</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="edit-image-url" 
                                                    checked={editImageInputType === "url"} 
                                                    onChange={() => setEditImageInputType("url")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="edit-image-url" className="font-normal cursor-pointer">URL</Label>
                                            </div>
                                        </div>
                                        {selectedService.image && (
                                            <div className="text-xs text-gray-500 truncate mb-1" title={selectedService.image}>
                                                Actuel: {selectedService.image.split("/").pop()}
                                            </div>
                                        )}
                                        <Input type="hidden" name="image" value={selectedService.image || ""} />
                                        {editImageInputType === "file" ? (
                                            <Input type="file" id="edit-imageFile" name="imageFile" accept="image/*" />
                                        ) : (
                                            <Input 
                                                type="url" 
                                                name="imageUrl" 
                                                defaultValue={selectedService.image?.startsWith("http") ? selectedService.image : ""}
                                                placeholder="https://exemple.com/image.jpg"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Icône du service</Label>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="edit-icon-file" 
                                                    checked={editIconInputType === "file"} 
                                                    onChange={() => setEditIconInputType("file")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="edit-icon-file" className="font-normal cursor-pointer">Fichier</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    id="edit-icon-url" 
                                                    checked={editIconInputType === "url"} 
                                                    onChange={() => setEditIconInputType("url")}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <Label htmlFor="edit-icon-url" className="font-normal cursor-pointer">URL</Label>
                                            </div>
                                        </div>
                                        {selectedService.icon && (
                                            <div className="text-xs text-gray-500 truncate mb-1" title={selectedService.icon}>
                                                Actuelle: {selectedService.icon.split("/").pop()}
                                            </div>
                                        )}
                                        <Input type="hidden" name="icon" value={selectedService.icon || ""} />
                                        {editIconInputType === "file" ? (
                                            <Input type="file" id="edit-iconFile" name="iconFile" accept="image/*" />
                                        ) : (
                                            <Input 
                                                type="url" 
                                                name="iconUrl" 
                                                defaultValue={selectedService.icon?.startsWith("http") ? selectedService.icon : ""}
                                                placeholder="https://exemple.com/icone.png"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-shortDesc">Description courte</Label>
                                    <Input id="edit-shortDesc" name="shortDesc" defaultValue={selectedService.shortDesc || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description détaillée</Label>
                                    <Textarea id="edit-description" name="description" rows={5} defaultValue={selectedService.description} required />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <Label htmlFor="edit-isActive" className="font-medium">Service actif</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedService.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-red-600 px-8">Mettre à jour</Button>
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
                            Êtes-vous sûr de vouloir supprimer le service <strong>{selectedService?.name}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedService) {
                                    await deleteService(selectedService.id);
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
