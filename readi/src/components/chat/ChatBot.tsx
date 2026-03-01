"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Bonjour ! Je suis l'assistant READI. Comment puis-je vous aider ?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulation de réponse IA
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Merci pour votre message. Un expert de READI.FR vous répondra très prochainement ou je peux vous aider sur nos services d'affichage dynamique." },
            ]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4"
                    >
                        <Card className="w-[350px] sm:w-[400px] shadow-2xl border-2 border-red-100 overflow-hidden flex flex-col h-[500px]">
                            <CardHeader className="bg-red-600 text-white p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-6 w-6" />
                                        <CardTitle className="text-lg">Assistant READI</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                                                    ? "bg-red-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                            <span className="text-xs text-gray-500">L'IA réfléchit...</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Écrivez votre question..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                        className="focus-visible:ring-red-600"
                                    />
                                    <Button onClick={handleSend} className="bg-red-600 hover:bg-red-700">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-gray-200 text-gray-600 rotate-90" : "bg-red-600 text-white hover:scale-110"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <MessageSquare className="h-6 w-6" />}
            </Button>
        </div>
    );
}
