"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Search, Paperclip, Send, User, Clock, Check, MoreVertical, Archive, Trash2, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    getConversations,
    getConversationMessages,
    sendMessage,
    updateConversationStatus,
    deleteConversation
} from "./messaging-actions";

// Types fictifs pour le prototype (à lier à Prisma plus tard)
export default function MessagingPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            };
            fetchMessages();
        }
    }, [selectedId]);

    const handleSend = async () => {
        if (!selectedId || !newMessage.trim()) return;

        try {
            const sent = await sendMessage(selectedId, newMessage);
            setMessages(prev => [...prev, sent]);
            setNewMessage("");
            // Update last message in conversations list
            setConversations(prev => prev.map(c =>
                c.id === selectedId ? { ...c, messages: [sent], lastMessageAt: new Date() } : c
            ));
        } catch (error) {
            console.error("Failed to send message", error);
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

    const selectedConv = conversations.find(c => c.id === selectedId);

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-6">
            {/* Liste des conversations */}
            <Card className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-2">
                <div className="p-4 border-b bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Rechercher..." className="pl-8 bg-white" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-gray-400 text-xs">Aucun message</div>
                    )}
                    {conversations.map((conv) => (
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
                            <p className="text-xs text-gray-600 line-clamp-1">
                                {conv.messages?.[0]?.content || "Aucun message"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                {conv.status !== "OPEN" && (
                                    <Badge variant="outline" className="text-[9px] h-4 uppercase">
                                        {conv.status}
                                    </Badge>
                                )}
                                {conv.unreadCount > 0 && (
                                    <Badge className="bg-red-600 hover:bg-red-700 h-5 px-1.5 min-w-[20px] justify-center">
                                        {conv.unreadCount}
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
                                        {msg.content}
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
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Paperclip className="h-5 w-5 text-gray-500" />
                                </Button>
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
                                    disabled={!newMessage.trim()}
                                    className="bg-red-600 hover:bg-red-700 h-10 px-5 shrink-0"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Envoyer
                                </Button>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Signature auto activée</span>
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
        </div>
    );
}
