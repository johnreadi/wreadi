"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
    Mail, Search, Paperclip, Send, User, Clock, Check, MoreVertical, 
    Archive, Trash2, XCircle, RotateCcw, Tag, StickyNote, Zap, 
    Filter, LayoutPanelLeft, Plus, Calendar, FileIcon, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    getConversations,
    getConversationMessages,
    sendMessage,
    updateConversationStatus,
    deleteConversation,
    updateConversationNotes,
    updateConversationTags,
    createConversation
} from "./messaging-actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const QUICK_REPLIES = [
    { label: "Bien reçu", text: "Bonjour,\n\nNous avons bien reçu votre message et nous revenons vers vous dans les plus brefs délais.\n\nCordialement,\nL'équipe READI" },
    { label: "Demande de précision", text: "Bonjour,\n\nPourriez-vous nous apporter quelques précisions concernant votre demande ?\n\nCordialement," },
    { label: "Clôture", text: "Bonjour,\n\nSans retour de votre part, nous procédons à la clôture de ce ticket. N'hésitez pas à revenir vers nous si besoin.\n\nCordialement," },
    { label: "Rendez-vous", text: "Bonjour,\n\nNous serions ravis de convenir d'un rendez-vous téléphonique pour en discuter. Quelles sont vos disponibilités ?\n\nCordialement," }
];

export default function MessagingPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Pro Tools State
    const [showProTools, setShowProTools] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL"); // ALL, OPEN, CLOSED, ARCHIVED
    const [searchTerm, setSearchTerm] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [tags, setTags] = useState("");

    // Attachments
    const [attachments, setAttachments] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New Conversation State
    const [isNewConvOpen, setIsNewConvOpen] = useState(false);
    const [newConvData, setNewConvData] = useState({
        email: "",
        name: "",
        subject: "",
        message: ""
    });
    const [newConvAttachments, setNewConvAttachments] = useState<any[]>([]);
    const newConvFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchConvs = async () => {
            const data = await getConversations();
            setConversations(data);
            if (data.length > 0 && !selectedId) {
                setSelectedId(data[0].id);
            }
            setIsLoading(false);
        };
        fetchConvs();
    }, []);

    useEffect(() => {
        if (selectedId) {
            const fetchMessages = async () => {
                const data = await getConversationMessages(selectedId);
                setMessages(data);
                
                // Load notes and tags for selected conversation
                const conv = conversations.find(c => c.id === selectedId);
                if (conv) {
                    setInternalNotes(conv.internalNotes || "");
                    setTags(conv.tags || "");
                }
            };
            fetchMessages();
        }
    }, [selectedId, conversations]);

    const handleFileUpload = async (files: FileList | null, isNewConv = false) => {
        if (!files || files.length === 0) return;

        const uploadedFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                if (res.ok) {
                    const data = await res.json();
                    uploadedFiles.push(data);
                }
            } catch (error) {
                console.error("Upload failed", error);
            }
        }

        if (isNewConv) {
            setNewConvAttachments(prev => [...prev, ...uploadedFiles]);
        } else {
            setAttachments(prev => [...prev, ...uploadedFiles]);
        }
    };

    const handleSend = async () => {
        if (!selectedId || (!newMessage.trim() && attachments.length === 0)) return;

        try {
            const sent = await sendMessage(selectedId, newMessage, "ADMIN", attachments);
            setMessages(prev => [...prev, sent]);
            setNewMessage("");
            setAttachments([]);
            // Update last message in conversations list
            setConversations(prev => prev.map(c =>
                c.id === selectedId ? { ...c, messages: [sent], lastMessageAt: new Date() } : c
            ));
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleCreateConversation = async () => {
        if (!newConvData.email || !newConvData.subject || !newConvData.message) return;

        try {
            const newConv = await createConversation(
                newConvData.email,
                newConvData.name || newConvData.email,
                newConvData.subject,
                newConvData.message,
                newConvAttachments
            );
            
            setConversations(prev => [newConv, ...prev]);
            setSelectedId(newConv.id);
            setIsNewConvOpen(false);
            setNewConvData({ email: "", name: "", subject: "", message: "" });
            setNewConvAttachments([]);
        } catch (error) {
            console.error("Failed to create conversation", error);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (!selectedId) return;
        try {
            await updateConversationStatus(selectedId, status);
            setConversations(prev => prev.map(c =>
                c.id === selectedId ? { ...c, status } : c
            ));
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleNotesUpdate = async () => {
        if (!selectedId) return;
        try {
            await updateConversationNotes(selectedId, internalNotes);
            setConversations(prev => prev.map(c => 
                c.id === selectedId ? { ...c, internalNotes } : c
            ));
        } catch (error) {
            console.error("Failed to update notes", error);
        }
    };

    const handleTagsUpdate = async () => {
        if (!selectedId) return;
        try {
            await updateConversationTags(selectedId, tags);
            setConversations(prev => prev.map(c => 
                c.id === selectedId ? { ...c, tags } : c
            ));
        } catch (error) {
            console.error("Failed to update tags", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedId || !confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) return;
        try {
            await deleteConversation(selectedId);
            setConversations(prev => prev.filter(c => c.id !== selectedId));
            setSelectedId(conversations.find(c => c.id !== selectedId)?.id || null);
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Failed to delete conversation", error);
        }
    };

    const handleAddToAgenda = () => {
        if (!selectedConv) return;
        // Redirect to agenda with pre-filled info
        const params = new URLSearchParams({
            action: 'new',
            title: `RDV avec ${selectedConv.participantName}`,
            participant: selectedConv.participantName,
            email: selectedConv.participantEmail
        });
        router.push(`/admin/agenda?${params.toString()}`);
    };

    const filteredConversations = conversations.filter(c => {
        const matchesStatus = activeTab === "ALL" ? true : c.status === activeTab;
        const matchesSearch = 
            c.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.subject && c.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.tags && c.tags.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const selectedConv = conversations.find(c => c.id === selectedId);

    const getTabLabel = (status: string) => {
        switch(status) {
            case "ALL": return "Tout";
            case "OPEN": return "Ouvert";
            case "CLOSED": return "Fermé";
            case "ARCHIVED": return "Archivé";
            default: return status;
        }
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-4">
            {/* Liste des conversations */}
            <Card className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-2">
                <div className="p-4 border-b bg-gray-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">Messages</h2>
                        <Dialog open={isNewConvOpen} onOpenChange={setIsNewConvOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700">
                                    <Plus className="h-4 w-4 mr-1" /> Nouveau
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Nouveau Message</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email du destinataire</Label>
                                            <Input 
                                                placeholder="client@exemple.com" 
                                                value={newConvData.email}
                                                onChange={(e) => setNewConvData({...newConvData, email: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nom (Optionnel)</Label>
                                            <Input 
                                                placeholder="Jean Dupont" 
                                                value={newConvData.name}
                                                onChange={(e) => setNewConvData({...newConvData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sujet</Label>
                                        <Input 
                                            placeholder="Sujet du message" 
                                            value={newConvData.subject}
                                            onChange={(e) => setNewConvData({...newConvData, subject: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea 
                                            placeholder="Votre message..." 
                                            className="min-h-[150px]"
                                            value={newConvData.message}
                                            onChange={(e) => setNewConvData({...newConvData, message: e.target.value})}
                                        />
                                    </div>
                                    
                                    {/* Attachments for New Conversation */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Pièces jointes</Label>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => newConvFileInputRef.current?.click()}
                                            >
                                                <Paperclip className="h-4 w-4 mr-2" /> Ajouter
                                            </Button>
                                            <input 
                                                type="file" 
                                                ref={newConvFileInputRef} 
                                                className="hidden" 
                                                multiple 
                                                onChange={(e) => handleFileUpload(e.target.files, true)}
                                            />
                                        </div>
                                        {newConvAttachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {newConvAttachments.map((file, idx) => (
                                                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                                        <X 
                                                            className="h-3 w-3 cursor-pointer hover:text-red-600" 
                                                            onClick={() => setNewConvAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsNewConvOpen(false)}>Annuler</Button>
                                    <Button onClick={handleCreateConversation} className="bg-red-600 hover:bg-red-700">Envoyer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Rechercher..." 
                            className="pl-8 bg-white" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                        {["ALL", "OPEN", "CLOSED", "ARCHIVED"].map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`text-[10px] px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                                    activeTab === status ? "bg-white shadow-sm font-medium text-blue-600" : "text-gray-500 hover:bg-gray-200"
                                }`}
                            >
                                {getTabLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-gray-400 text-xs">Aucune conversation trouvée</div>
                    )}
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedId(conv.id)}
                            className={`p-4 cursor-pointer hover:bg-red-50 transition-colors border-b last:border-0 relative ${selectedId === conv.id ? "bg-red-50 border-r-4 border-r-red-600" : ""
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm truncate w-32">{conv.participantName}</span>
                                <span className="text-[10px] text-gray-500">
                                    {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                                {conv.subject || "Pas de sujet"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                {conv.status !== "OPEN" && (
                                    <Badge variant="outline" className="text-[9px] h-4 uppercase">
                                        {getTabLabel(conv.status)}
                                    </Badge>
                                )}
                                {conv.tags && (
                                    <Badge variant="secondary" className="text-[9px] h-4 bg-blue-100 text-blue-700">
                                        {conv.tags.split(',')[0]}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Zone de discussion */}
            <Card className="flex-1 flex flex-col overflow-hidden border-2">
                {selectedConv ? (
                    <>
                        {/* Header discussion */}
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                    {selectedConv.participantName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedConv.participantName}</h3>
                                    <p className="text-xs text-gray-500">{selectedConv.participantEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 relative">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleAddToAgenda}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Agenda
                                </Button>

                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setShowProTools(!showProTools)}
                                    className={showProTools ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
                                >
                                    <LayoutPanelLeft className="h-4 w-4 mr-2" />
                                    Outils Pro
                                </Button>
                                
                                {selectedConv.status === "OPEN" ? (
                                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("CLOSED")}>
                                        Fermer le ticket
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50" onClick={() => handleStatusUpdate("OPEN")}>
                                        <RotateCcw className="h-4 w-4 mr-2" /> Rouvrir
                                    </Button>
                                )}

                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border p-2 z-50">
                                            <button
                                                onClick={() => handleStatusUpdate("ARCHIVED")}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-gray-600"
                                            >
                                                <Archive className="h-4 w-4" /> Archiver
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate("CLOSED")}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-gray-600"
                                            >
                                                <XCircle className="h-4 w-4" /> Fermer
                                            </button>
                                            <Separator className="my-1" />
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-red-50 rounded-lg text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" /> Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 py-10">Aucun message dans cette discussion</div>
                            )}

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.senderType === "ADMIN" ? "items-end ml-auto" : "items-start"} max-w-[80%]`}
                                >
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.senderType === "ADMIN"
                                        ? "bg-red-600 text-white rounded-tr-none"
                                        : "bg-white border rounded-tl-none"
                                        }`}>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                        
                                        {/* Attachments Display */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.attachments.map((att: any) => (
                                                    <a 
                                                        key={att.id} 
                                                        href={att.fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 p-2 rounded-lg ${
                                                            msg.senderType === "ADMIN" ? "bg-red-700/50 hover:bg-red-700" : "bg-gray-100 hover:bg-gray-200"
                                                        } transition-colors`}
                                                    >
                                                        <FileIcon className="h-4 w-4" />
                                                        <span className="truncate max-w-[200px] text-xs underline">{att.fileName}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`text-[10px] mt-2 flex items-center gap-1 ${msg.senderType === "ADMIN" ? "text-red-100 justify-end" : "text-gray-400"
                                            }`}>
                                            <Clock className="h-3 w-3" />
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {msg.senderType === "ADMIN" && <Check className="h-3 w-3 ml-1" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Zone de réponse */}
                        <div className="p-4 border-t bg-white">
                            {/* Attachment Previews */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
                                    {attachments.map((file, idx) => (
                                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 bg-white border">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <X 
                                                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                                                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="shrink-0"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="h-5 w-5 text-gray-500" />
                                </Button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    multiple 
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                                
                                <div className="flex-1">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre réponse professionnelle..."
                                        className="w-full min-h-[80px] p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all resize-none"
                                    />
                                </div>
                                <Button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim() && attachments.length === 0}
                                    className="bg-red-600 hover:bg-red-700 h-10 px-5 shrink-0"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Envoyer
                                </Button>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Réponse par email activée</span>
                                <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" /> Max 20Mo</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <Mail className="h-16 w-16 opacity-20" />
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </Card>

            {/* Outils Pro Panel */}
            {showProTools && selectedConv && (
                <Card className="w-80 flex-shrink-0 flex flex-col border-2 overflow-hidden bg-gray-50/30">
                    <div className="p-4 border-b bg-gray-100/50">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Outils Pro
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Quick Replies */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <Send className="h-3 w-3" /> Réponses Rapides
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {QUICK_REPLIES.map((qr, idx) => (
                                    <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        className="justify-start h-auto py-2 text-left bg-white"
                                        onClick={() => setNewMessage(qr.text)}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium text-xs">{qr.label}</span>
                                            <span className="text-[10px] text-gray-400 line-clamp-1">{qr.text}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Internal Notes */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <StickyNote className="h-3 w-3" /> Notes Internes
                            </Label>
                            <Textarea 
                                placeholder="Ajoutez une note privée..." 
                                className="bg-yellow-50/50 border-yellow-200 min-h-[100px] text-xs resize-none"
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                onBlur={handleNotesUpdate}
                            />
                            <p className="text-[10px] text-gray-400">Sauvegarde automatique au clic hors du champ.</p>
                        </div>

                        <Separator />

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                <Tag className="h-3 w-3" /> Tags / Étiquettes
                            </Label>
                            <Input 
                                placeholder="Urgent, Vente, Support..." 
                                className="bg-white"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onBlur={handleTagsUpdate}
                            />
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] bg-gray-200">
                                        {tag.trim()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
