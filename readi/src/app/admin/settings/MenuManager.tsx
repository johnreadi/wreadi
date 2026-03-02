"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, GripVertical, Plus, Edit, Save, X, ExternalLink } from "lucide-react";
import { createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } from "./menu-actions";
import { toast } from "sonner";

export function MenuManager({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState({ label: "", href: "", target: "_self" });
    const [editForm, setEditForm] = useState({ label: "", href: "", target: "_self" });

    const handleCreate = () => {
        if (!newItem.label || !newItem.href) return;
        startTransition(async () => {
            await createMenuItem(newItem);
            setNewItem({ label: "", href: "", target: "_self" });
            toast.success("Menu item added");
            // Optimistic update or refresh needed ideally, but revalidatePath handles it on next load
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) {
            startTransition(async () => {
                await deleteMenuItem(id);
                setItems(items.filter(i => i.id !== id));
                toast.success("Menu item deleted");
            });
        }
    };

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setEditForm({ label: item.label, href: item.href, target: item.target });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = (id: string) => {
        startTransition(async () => {
            await updateMenuItem(id, editForm);
            setEditingId(null);
            toast.success("Menu item updated");
        });
    };

    return (
        <Card className="border-2 border-blue-100 shadow-lg rounded-3xl overflow-hidden mt-8">
            <CardHeader className="bg-blue-50/50 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase text-gray-900">
                    <GripVertical className="h-6 w-6 text-blue-600" />
                    Gestion du Menu Principal
                </CardTitle>
                <CardDescription className="font-medium">
                    Ajoutez, modifiez ou supprimez les liens de navigation.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {/* Add New Item */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Libellé</Label>
                        <Input 
                            value={newItem.label} 
                            onChange={e => setNewItem({...newItem, label: e.target.value})}
                            placeholder="ex: Accueil"
                            className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Lien (URL)</Label>
                        <Input 
                            value={newItem.href} 
                            onChange={e => setNewItem({...newItem, href: e.target.value})}
                            placeholder="ex: / ou https://..."
                            className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Cible</Label>
                        <select 
                            value={newItem.target}
                            onChange={e => setNewItem({...newItem, target: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="_self">Même onglet</option>
                            <option value="_blank">Nouvel onglet</option>
                        </select>
                    </div>
                    <Button onClick={handleCreate} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 font-bold">
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                </div>

                {/* List Items */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead>Lien</TableHead>
                                <TableHead className="w-[100px]">Cible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell><GripVertical className="h-4 w-4 text-gray-300 cursor-move" /></TableCell>
                                    <TableCell className="font-bold">
                                        {editingId === item.id ? (
                                            <Input value={editForm.label} onChange={e => setEditForm({...editForm, label: e.target.value})} />
                                        ) : item.label}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-blue-600">
                                        {editingId === item.id ? (
                                            <Input value={editForm.href} onChange={e => setEditForm({...editForm, href: e.target.value})} />
                                        ) : item.href}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === item.id ? (
                                            <select 
                                                value={editForm.target}
                                                onChange={e => setEditForm({...editForm, target: e.target.value})}
                                                className="w-full text-sm border rounded p-1"
                                            >
                                                <option value="_self">_self</option>
                                                <option value="_blank">_blank</option>
                                            </select>
                                        ) : (
                                            item.target === "_blank" ? <ExternalLink className="h-3 w-3 text-gray-400" /> : <span className="text-gray-300">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {editingId === item.id ? (
                                            <>
                                                <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)}><Save className="h-4 w-4 text-green-600" /></Button>
                                                <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="h-4 w-4 text-gray-400" /></Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="ghost" onClick={() => startEdit(item)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                                        Aucun élément de menu. Ajoutez-en un ci-dessus.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
