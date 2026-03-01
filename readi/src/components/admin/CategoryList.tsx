"use client";

import { useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    LayoutGrid,
    Save,
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
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus
} from "@/app/admin/content/categories/category-actions";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    _count: {
        services: number;
    };
}

interface CategoryListProps {
    initialCategories: Category[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <LayoutGrid className="h-8 w-8 text-blue-600" />
                    Gestion des Catégories
                </h1>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={async (formData) => {
                            await createCategory(formData);
                            setIsAddOpen(false);
                        }}>
                            <DialogHeader>
                                <DialogTitle>Ajouter une catégorie</DialogTitle>
                                <DialogDescription>
                                    Créez une nouvelle catégorie de services pour votre site.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de la catégorie</Label>
                                    <Input id="name" name="name" placeholder="ex: Informatique" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Courte description..." />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Activer la catégorie</Label>
                                    <Switch id="isActive" name="isActive" defaultChecked />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600">Enregistrer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {initialCategories.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            Aucune catégorie trouvée.
                        </CardContent>
                    </Card>
                ) : (
                    initialCategories.map((category) => (
                        <Card key={category.id} className="hover:border-blue-200 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${category.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"} rounded-lg flex items-center justify-center`}>
                                        <LayoutGrid className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{category.name}</CardTitle>
                                        <CardDescription>Slug: {category.slug} • {category._count.services} services associés</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                                        className="focus:outline-none"
                                        title={category.isActive ? "Désactiver" : "Activer"}
                                    >
                                        <Badge variant={category.isActive ? "default" : "secondary"} className="cursor-pointer hover:opacity-80 transition-opacity">
                                            {category.isActive ? "Actif" : "Inactif"}
                                        </Badge>
                                    </button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(category)}>
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
                <DialogContent>
                    {selectedCategory && (
                        <form action={async (formData) => {
                            await updateCategory(selectedCategory.id, formData);
                            setIsEditOpen(false);
                        }}>
                            <DialogHeader>
                                <DialogTitle>Modifier la catégorie</DialogTitle>
                                <DialogDescription>
                                    Mettez à jour les informations de {selectedCategory.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nom de la catégorie</Label>
                                    <Input id="edit-name" name="name" defaultValue={selectedCategory.name} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea id="edit-description" name="description" defaultValue={selectedCategory.description || ""} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="edit-isActive">Activer la catégorie</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedCategory.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600">Mettre à jour</Button>
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
                            Êtes-vous sûr de vouloir supprimer la catégorie <strong>{selectedCategory?.name}</strong> ?
                            Cette action est irréversible et pourrait affecter les services liés.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedCategory) {
                                    await deleteCategory(selectedCategory.id);
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
