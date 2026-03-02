"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, GripVertical, Plus, Edit, Save, X, Type, Image as ImageIcon, FastForward, Clock, ArrowRightLeft } from "lucide-react";
import { createTopBarItem, updateTopBarItem, deleteTopBarItem } from "./menu-actions";
import { toast } from "sonner";

export function TopBarManager({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Item State
    const [newItem, setNewItem] = useState({ type: "TEXT", content: "" });
    const [newSettings, setNewSettings] = useState({ duration: 10, direction: "left" });

    // Edit State
    const [editForm, setEditForm] = useState({ type: "TEXT", content: "" });
    const [editSettings, setEditSettings] = useState({ duration: 10, direction: "left" });

    const handleCreate = () => {
        if (!newItem.content) return;
        startTransition(async () => {
            const settingsStr = JSON.stringify(newSettings);
            const createdItem = await createTopBarItem({ ...newItem, settings: settingsStr });
            setItems([...items, createdItem]);
            setNewItem({ type: "TEXT", content: "" });
            setNewSettings({ duration: 10, direction: "left" });
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
        setEditForm({ type: item.type, content: item.content });
        try {
            const parsed = JSON.parse(item.settings || "{}");
            setEditSettings({
                duration: parsed.duration || 10,
                direction: parsed.direction || "left"
            });
        } catch {
            setEditSettings({ duration: 10, direction: "left" });
        }
    };

    const saveEdit = (id: string) => {
        startTransition(async () => {
            const settingsStr = JSON.stringify(editSettings);
            const updatedItem = await updateTopBarItem(id, { ...editForm, settings: settingsStr });
            setItems(items.map(i => i.id === id ? updatedItem : i));
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
                    
                    {newItem.type === 'SCROLL' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-400">Durée (s)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input 
                                        type="number"
                                        value={newSettings.duration}
                                        onChange={e => setNewSettings({...newSettings, duration: parseInt(e.target.value) || 10})}
                                        className="pl-8 bg-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-400">Sens</Label>
                                <div className="relative">
                                    <ArrowRightLeft className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <select 
                                        value={newSettings.direction}
                                        onChange={e => setNewSettings({...newSettings, direction: e.target.value})}
                                        className="flex h-10 w-full rounded-md border border-input bg-white pl-8 pr-3 py-2 text-sm"
                                    >
                                        <option value="left">Gauche</option>
                                        <option value="right">Droite</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <Button onClick={handleCreate} disabled={isPending} className="bg-purple-600 hover:bg-purple-700 font-bold md:col-span-1 h-10 w-full">
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                </div>

                {/* List Items */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[100px]">Type</TableHead>
                                <TableHead>Contenu & Paramètres</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs font-bold align-top pt-4">
                                        {editingId === item.id ? (
                                            <select 
                                                value={editForm.type}
                                                onChange={e => setEditForm({...editForm, type: e.target.value})}
                                                className="border rounded p-1 w-full"
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
                                    <TableCell className="font-medium pt-3 pb-3">
                                        {editingId === item.id ? (
                                            <div className="space-y-2">
                                                <Input value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} placeholder="Content" />
                                                {editForm.type === 'SCROLL' && (
                                                    <div className="flex gap-2">
                                                        <div className="w-24">
                                                            <Label className="text-[10px] text-gray-400">Durée (s)</Label>
                                                            <Input 
                                                                type="number" 
                                                                value={editSettings.duration} 
                                                                onChange={e => setEditSettings({...editSettings, duration: parseInt(e.target.value) || 10})} 
                                                                className="h-8"
                                                            />
                                                        </div>
                                                        <div className="w-32">
                                                            <Label className="text-[10px] text-gray-400">Sens</Label>
                                                            <select 
                                                                value={editSettings.direction}
                                                                onChange={e => setEditSettings({...editSettings, direction: e.target.value})}
                                                                className="flex h-8 w-full rounded-md border border-input bg-white px-2 py-1 text-sm"
                                                            >
                                                                <option value="left">Gauche</option>
                                                                <option value="right">Droite</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <span>{item.content}</span>
                                                {item.type === 'SCROLL' && item.settings && (
                                                    <div className="flex gap-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {JSON.parse(item.settings).duration || 10}s</span>
                                                        <span className="flex items-center gap-1"><ArrowRightLeft className="h-3 w-3" /> {JSON.parse(item.settings).direction === 'right' ? 'Droite' : 'Gauche'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right align-top pt-4">
                                        {editingId === item.id ? (
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(item.id)}><Save className="h-4 w-4 text-green-600" /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}><X className="h-4 w-4 text-gray-400" /></Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(item)}><Edit className="h-4 w-4 text-purple-600" /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                                            </div>
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
