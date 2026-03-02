"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Package, Search, AlertTriangle, Save, Filter } from "lucide-react";
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
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
} from "@/app/admin/products/product-actions";

type ProductWithCategory = {
    id: string;
    name: string;
    reference: string | null;
    description: string | null;
    price: number | null;
    image: string | null;
    stock: number;
    isActive: boolean;
    categoryId: string;
    category: { name: string };
    brand: string | null;
    series: string | null;
    model: string | null;
};

type Category = {
    id: string;
    name: string;
};

interface ProductListProps {
    initialProducts: ProductWithCategory[];
    categories: Category[];
}

export function ProductList({ initialProducts, categories }: ProductListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredProducts = initialProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            (product.reference && product.reference.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product: ProductWithCategory) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleDelete = (product: ProductWithCategory) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="h-8 w-8 text-orange-600" />
                    Catalogue Produits
                </h1>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Rechercher (Nom, Réf...)"
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter un produit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <form action={async (formData) => {
                                await createProduct(formData);
                                setIsAddOpen(false);
                            }}>
                                <DialogHeader>
                                    <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                                    <DialogDescription>
                                        Remplissez les informations pour le catalogue pièces détachées.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom du produit *</Label>
                                            <Input id="name" name="name" placeholder="Ex: Cartouche Canon PIXMA" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reference">Référence constructeur</Label>
                                            <Input id="reference" name="reference" placeholder="Ex: CLI-581XXL" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryId">Catégorie *</Label>
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
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Prix (€)</Label>
                                                <Input id="price" name="price" type="number" step="0.01" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stock">Stock</Label>
                                                <Input id="stock" name="stock" type="number" defaultValue="0" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" placeholder="Détails techniques..." />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="imageFile">Image du produit</Label>
                                        <Input type="file" id="imageFile" name="imageFile" accept="image/*" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="brand">Marque</Label>
                                            <Input id="brand" name="brand" placeholder="Canon" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="series">Série</Label>
                                            <Input id="series" name="series" placeholder="PIXMA" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="model">Modèle</Label>
                                            <Input id="model" name="model" placeholder="TS8350" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <Label htmlFor="isActive" className="font-medium text-orange-900">Afficher dans le configurateur</Label>
                                        <Switch id="isActive" name="isActive" defaultChecked />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-orange-600 px-8">Enregistrer</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-lg">Liste des produits ({filteredProducts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Nom / Réf</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Catégorie</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Prix</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Stock</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            Aucun produit trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{product.name}</div>
                                                <code className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded uppercase">
                                                    {product.reference || "SANS REF"}
                                                </code>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {product.category.name}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-semibold">
                                                {product.price ? `${product.price.toFixed(2)} €` : "N/A"}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={product.stock > 0 ? "outline" : "destructive"} className={product.stock > 0 ? "border-green-200 text-green-700 bg-green-50" : ""}>
                                                    {product.stock} en stock
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${product.isActive ? "bg-green-500" : "bg-gray-300"}`}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${product.isActive ? "left-[22px]" : "left-0.5"}`} />
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} title="Modifier">
                                                        <Edit3 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} title="Supprimer">
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    {selectedProduct && (
                        <form action={async (formData) => {
                            await updateProduct(selectedProduct.id, formData);
                            setIsEditOpen(false);
                        }}>
                            <DialogHeader>
                                <DialogTitle>Modifier le produit</DialogTitle>
                                <DialogDescription>
                                    Édition de : {selectedProduct.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Nom du produit *</Label>
                                        <Input id="edit-name" name="name" defaultValue={selectedProduct.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-reference">Référence constructeur</Label>
                                        <Input id="edit-reference" name="reference" defaultValue={selectedProduct.reference || ""} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-categoryId">Catégorie *</Label>
                                        <Select name="categoryId" defaultValue={selectedProduct.categoryId} required>
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-price">Prix (€)</Label>
                                            <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={selectedProduct.price || ""} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-stock">Stock</Label>
                                            <Input id="edit-stock" name="stock" type="number" defaultValue={selectedProduct.stock} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea id="edit-description" name="description" defaultValue={selectedProduct.description || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-imageFile">Image du produit</Label>
                                    {selectedProduct.image && (
                                        <div className="text-xs text-gray-500 mb-1 truncate">Actuelle: {selectedProduct.image.split("/").pop()}</div>
                                    )}
                                    <Input type="hidden" name="image" value={selectedProduct.image || ""} />
                                    <Input type="file" id="edit-imageFile" name="imageFile" accept="image/*" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-brand">Marque</Label>
                                        <Input id="edit-brand" name="brand" defaultValue={selectedProduct.brand || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-series">Série</Label>
                                        <Input id="edit-series" name="series" defaultValue={selectedProduct.series || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-model">Modèle</Label>
                                        <Input id="edit-model" name="model" defaultValue={selectedProduct.model || ""} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <Label htmlFor="edit-isActive" className="font-medium">Produit actif</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedProduct.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-orange-600 px-8">Enregistrer les modifications</Button>
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
                            Êtes-vous sûr de vouloir supprimer le produit <strong>{selectedProduct?.name}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedProduct) {
                                    await deleteProduct(selectedProduct.id);
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
