"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
    title?: string | null;
    description?: string | null;
    successTitle?: string | null;
    successMessage?: string | null;
}

export function ContactForm({
    title = "Envoyez-nous un message",
    description = "Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
    successTitle = "Message envoyé !",
    successMessage = "Merci de nous avoir contacté. Nous vous répondrons rapidement."
}: ContactFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaError, setCaptchaError] = useState(false);

    useEffect(() => {
        setCaptcha({
            a: Math.floor(Math.random() * 10) + 1,
            b: Math.floor(Math.random() * 10) + 1,
        });
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (parseInt(captchaInput) !== captcha.a + captcha.b) {
            setCaptchaError(true);
            return;
        }
        setCaptchaError(false);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <Card className="border-2 border-red-50 shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-red-50/50 pb-8">
                <CardTitle className="text-2xl font-black uppercase text-gray-900">{title}</CardTitle>
                <CardDescription className="text-base font-medium text-gray-500">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                {submitted ? (
                    <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase">{successTitle}</h3>
                        <p className="text-gray-600 max-w-sm mx-auto font-medium">
                            {successMessage}
                        </p>
                        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-8 rounded-xl border-2">
                            Envoyer un autre message
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-xs font-black uppercase text-gray-400 tracking-widest">Nom complet *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Jean Dupont"
                                    className="h-12 border-2 rounded-xl focus:border-red-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-xs font-black uppercase text-gray-400 tracking-widest">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jean@exemple.fr"
                                    className="h-12 border-2 rounded-xl focus:border-red-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-xs font-black uppercase text-gray-400 tracking-widest">Téléphone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="06 12 34 56 78"
                                    className="h-12 border-2 rounded-xl focus:border-red-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="subject" className="text-xs font-black uppercase text-gray-400 tracking-widest">Sujet *</Label>
                                <Input
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Demande de devis"
                                    className="h-12 border-2 rounded-xl focus:border-red-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="message" className="text-xs font-black uppercase text-gray-400 tracking-widest">Message *</Label>
                            <Textarea
                                id="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Décrivez votre projet ou votre question..."
                                className="border-2 rounded-2xl focus:border-red-500 transition-all font-medium p-4"
                            />
                        </div>

                        {/* Sécurité Anti-Spam */}
                        <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <Label htmlFor="captcha" className="text-xs font-black uppercase text-gray-400 tracking-widest">
                                Sécurité anti-spam
                            </Label>
                            <p className="text-sm text-gray-600 font-bold italic">
                                Combien font {captcha.a} + {captcha.b} ? *
                            </p>
                            <Input
                                id="captcha"
                                required
                                type="number"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Votre réponse"
                                className={`h-12 border-2 rounded-xl ${captchaError ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>

                        <Button type="submit" className="w-full h-16 bg-red-600 hover:bg-red-700 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-95">
                            <Send className="mr-3 h-5 w-5" />
                            Envoyer le message
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
