"use client";

import { useState } from "react";
import {
    Plus,
    Edit3,
    Trash2,
    Award,
    Star,
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
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialStatus
} from "@/app/admin/content/testimonials/testimonial-actions";

interface Testimonial {
    id: string;
    name: string;
    company: string | null;
    content: string;
    rating: number;
    isActive: boolean;
}

interface TestimonialListProps {
    initialTestimonials: Testimonial[];
}

export function TestimonialList({ initialTestimonials }: TestimonialListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    const handleEdit = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsEditOpen(true);
    };

    const handleDelete = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Award className="h-8 w-8 text-yellow-600" />
                    Gestion des Témoignages
                </h1>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un témoignage
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form action={async (formData) => {
                            await createTestimonial(formData);
                            setIsAddOpen(false);
                        }}>
                            <DialogHeader>
                                <DialogTitle>Ajouter un avis client</DialogTitle>
                                <DialogDescription>
                                    Insérez un nouveau témoignage pour renforcer la confiance.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom du client</Label>
                                        <Input id="name" name="name" placeholder="ex: Marc Durand" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Note (1-5)</Label>
                                        <Select name="rating" defaultValue="5">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[5, 4, 3, 2, 1].map(n => (
                                                    <SelectItem key={n} value={n.toString()}>{n} étoiles</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Entreprise (optionnel)</Label>
                                    <Input id="company" name="company" placeholder="ex: Société XYZ" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Témoignage</Label>
                                    <Textarea id="content" name="content" rows={4} placeholder="Ce que le client dit..." required />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Activer le témoignage</Label>
                                    <Switch id="isActive" name="isActive" defaultChecked />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-yellow-600">Publier l'avis</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {initialTestimonials.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            Aucun témoignage trouvé.
                        </CardContent>
                    </Card>
                ) : (
                    initialTestimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="hover:border-yellow-200 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${testimonial.isActive ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-400"} rounded-lg flex items-center justify-center`}>
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                                {testimonial.rating} <Star className="h-3 w-3 fill-yellow-600 border-none" />
                                            </Badge>
                                        </div>
                                        <CardDescription>{testimonial.company || "Client"}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleTestimonialStatus(testimonial.id, testimonial.isActive)}
                                        className="focus:outline-none"
                                    >
                                        <Badge variant={testimonial.isActive ? "default" : "secondary"} className="cursor-pointer hover:opacity-80 transition-opacity">
                                            {testimonial.isActive ? "Actif" : "Inactif"}
                                        </Badge>
                                    </button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(testimonial)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4">
                                <p className="text-sm text-gray-600 line-clamp-2 italic px-14">
                                    "{testimonial.content}"
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    {selectedTestimonial && (
                        <form action={async (formData) => {
                            await updateTestimonial(selectedTestimonial.id, formData);
                            setIsEditOpen(false);
                        }}>
                            <DialogHeader>
                                <DialogTitle>Modifier le témoignage</DialogTitle>
                                <DialogDescription>
                                    Mettez à jour les propos de {selectedTestimonial.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Nom du client</Label>
                                        <Input id="edit-name" name="name" defaultValue={selectedTestimonial.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-rating">Note</Label>
                                        <Select name="rating" defaultValue={selectedTestimonial.rating.toString()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[5, 4, 3, 2, 1].map(n => (
                                                    <SelectItem key={n} value={n.toString()}>{n} étoiles</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-company">Entreprise</Label>
                                    <Input id="edit-company" name="company" defaultValue={selectedTestimonial.company || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-content">Témoignage</Label>
                                    <Textarea id="edit-content" name="content" rows={4} defaultValue={selectedTestimonial.content} required />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="edit-isActive">Activer</Label>
                                    <Switch id="edit-isActive" name="isActive" defaultChecked={selectedTestimonial.isActive} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-yellow-600">Enregistrer les modifications</Button>
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
                            Êtes-vous sûr de vouloir supprimer ce témoignage ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (selectedTestimonial) {
                                    await deleteTestimonial(selectedTestimonial.id);
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
