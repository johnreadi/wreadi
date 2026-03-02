"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, GripVertical, Plus, Edit, Save, X, Type, Image as ImageIcon, FastForward } from "lucide-react";
import { createTopBarItem, updateTopBarItem, deleteTopBarItem } from "./menu-actions";
import { toast } from "sonner";

export function TopBarManager({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState({ type: "TEXT", content: "", settings: "{}" });
    const [editForm, setEditForm] = useState({ type: "TEXT", content: "", settings: "{}" });

    const handleCreate = () => {
        if (!newItem.content) return;
        startTransition(async () => {
            await createTopBarItem(newItem);
            setNewItem({ type: "TEXT", content: "", settings: "{}" });
            toast.success("Element added");
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) {
            startTransition(async () => {
                await deleteTopBarItem(id);
                setItems(items.filter(i => i.id !== id));
                toast.success("Element deleted");
            });
        }
    };

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setEditForm({ type: item.type, content: item.content, settings: item.settings || "{}" });
    };

    const saveEdit = (id: string) => {
        startTransition(async () => {
            await updateTopBarItem(id, editForm);
            setEditingId(null);
            toast.success("Element updated");
        });
    };

    return (
        <Card className="border-2 border-purple-100 shadow-lg rounded-3xl overflow-hidden mt-8">
            <CardHeader className="bg-purple-50/50 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase text-gray-900">
                    <FastForward className="h-6 w-6 text-purple-600" />
                    Gestion de la Barre d'Information (Top Bar)
                </CardTitle>
                <CardDescription className="font-medium">
                    Ajoutez du texte, du défilement ou des images dans la barre supérieure.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {/* Add New Item */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Type</Label>
                        <select 
                            value={newItem.type}
                            onChange={e => setNewItem({...newItem, type: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                        >
                            <option value="TEXT">Texte Simple</option>
                            <option value="SCROLL">Texte Défilant</option>
                            <option value="IMAGE">Image (URL)</option>
                        </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className="text-xs font-bold uppercase text-gray-400">Contenu (Texte ou URL)</Label>
                        <Input 
                            value={newItem.content} 
                            onChange={e => setNewItem({...newItem, content: e.target.value})}
                            placeholder="Contenu..."
                            className="bg-white"
                        />
                    </div>
                    <Button onClick={handleCreate} disabled={isPending} className="bg-purple-600 hover:bg-purple-700 font-bold">
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                </div>

                {/* List Items */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Contenu</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs font-bold">
                                        {editingId === item.id ? (
                                            <select 
                                                value={editForm.type}
                                                onChange={e => setEditForm({...editForm, type: e.target.value})}
                                                className="border rounded p-1"
                                            >
                                                <option value="TEXT">TEXT</option>
                                                <option value="SCROLL">SCROLL</option>
                                                <option value="IMAGE">IMAGE</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-[10px] ${item.type === 'SCROLL' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                                                {item.type}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {editingId === item.id ? (
                                            <Input value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} />
                                        ) : item.content}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {editingId === item.id ? (
                                            <>
                                                <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)}><Save className="h-4 w-4 text-green-600" /></Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4 text-gray-400" /></Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="ghost" onClick={() => startEdit(item)}><Edit className="h-4 w-4 text-purple-600" /></Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                        Aucun élément.
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
