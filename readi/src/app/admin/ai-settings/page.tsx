import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Bot, Save, Sparkles, Zap, Globe } from "lucide-react";
import { revalidatePath } from "next/cache";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

async function getSettings() {
    let settings = await prisma.siteSettings.findUnique({
        where: { id: "default" },
    });

    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                id: "default",
                aiEnabled: true,
                aiWelcomeMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
                aiInstructions: "Tu es l'assistant IA de READI.FR, un expert en affichage dynamique et maintenance informatique depuis 1994. Sois poli, professionnel et aide les clients à comprendre nos services.",
                aiModel: "gpt-4o",
                aiTemperature: 0.7,
            },
        });
    }

    return settings;
}

export default async function AISettingsPage() {
    const settings = await getSettings();

    const aiModels = [
        { id: "gpt-4o", name: "OpenAI GPT-4o (Recommandé)", provider: "USA" },
        { id: "gpt-4o-mini", name: "OpenAI GPT-4o Mini", provider: "USA" },
        { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "USA" },
        { id: "deepseek-chat", name: "DeepSeek-V3 (Asiatique - Performance)", provider: "Asie" },
        { id: "deepseek-reasoner", name: "DeepSeek-R1 (Asiatique - Raisonnement)", provider: "Asie" },
        { id: "qwen-max", name: "Qwen Max (Alibaba - Haut de gamme)", provider: "Asie" },
        { id: "qwen-plus", name: "Qwen Plus (Alibaba - Rapide)", provider: "Asie" },
    ];

    async function updateSettings(formData: FormData) {
        "use server";

        const aiEnabled = formData.get("aiEnabled") === "on";
        const aiWelcomeMessage = formData.get("aiWelcomeMessage") as string;
        const aiInstructions = formData.get("aiInstructions") as string;
        const aiModel = formData.get("aiModel") as string;
        const aiApiKey = formData.get("aiApiKey") as string;
        const aiTemperature = parseFloat(formData.get("aiTemperature") as string || "0.7");

        await prisma.siteSettings.update({
            where: { id: "default" },
            data: {
                aiEnabled,
                aiWelcomeMessage,
                aiInstructions,
                aiModel,
                aiApiKey: aiApiKey || undefined,
                aiTemperature,
            },
        });

        revalidatePath("/admin/ai-settings");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bot className="h-8 w-8 text-red-600" />
                    Réglages de l'IA & ChatBot
                </h1>
            </div>

            <form action={updateSettings}>
                <div className="grid gap-6">
                    <Card className="border-2 border-red-100">
                        <CardHeader className="bg-red-50/50">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-red-600" />
                                Configuration du ChatBot
                            </CardTitle>
                            <CardDescription>
                                Personnalisez le comportement, les modèles (dont les IA asiatiques performantes) et les clés API de votre assistant.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Toggle Activation */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-semibold">Activer le ChatBot</Label>
                                    <p className="text-sm text-gray-500">
                                        Affiche ou masque la bulle de discussion sur le site public.
                                    </p>
                                </div>
                                <Switch name="aiEnabled" defaultChecked={settings.aiEnabled} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Choix du modèle */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-orange-500" />
                                        Modèle d'IA
                                    </Label>
                                    <Select name="aiModel" defaultValue={settings.aiModel}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionnez un modèle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="header-usa" disabled className="bg-gray-50 font-bold">Modèles Occidentaux</SelectItem>
                                            {aiModels.filter(m => m.provider === "USA").map(model => (
                                                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                            ))}
                                            <SelectItem value="header-asia" disabled className="bg-gray-50 font-bold">Modèles Asiatiques (Eco/Performance)</SelectItem>
                                            {aiModels.filter(m => m.provider === "Asie").map(model => (
                                                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Les modèles asiatiques (DeepSeek, Qwen) offrent souvent un meilleur rapport performance/prix.
                                    </p>
                                </div>

                                {/* Clé API */}
                                <div className="space-y-2">
                                    <Label htmlFor="aiApiKey" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-blue-500" />
                                        Clé API (Optionnelle)
                                    </Label>
                                    <Input
                                        id="aiApiKey"
                                        name="aiApiKey"
                                        type="password"
                                        defaultValue={settings.aiApiKey || ""}
                                        placeholder="Sk-..."
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Laisse vide pour utiliser la clé configurée par défaut dans le système.
                                    </p>
                                </div>
                            </div>

                            {/* Message de bienvenue */}
                            <div className="space-y-2">
                                <Label htmlFor="aiWelcomeMessage">Message de bienvenue</Label>
                                <Input
                                    id="aiWelcomeMessage"
                                    name="aiWelcomeMessage"
                                    defaultValue={settings.aiWelcomeMessage || ""}
                                    placeholder="Ex: Bonjour ! En quoi puis-je vous aider ?"
                                />
                            </div>

                            {/* Instructions / Prompt */}
                            <div className="space-y-2">
                                <Label htmlFor="aiInstructions">Instructions Système (Prompt)</Label>
                                <CardDescription className="mb-2">
                                    Définissez la personnalité et les connaissances de l'IA (tarifs, services, histoire).
                                </CardDescription>
                                <Textarea
                                    id="aiInstructions"
                                    name="aiInstructions"
                                    className="min-h-[150px] font-mono text-sm"
                                    defaultValue={settings.aiInstructions || ""}
                                    placeholder="Tu es l'assistant de..."
                                />
                            </div>

                            {/* Température */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Température (Créativité)</Label>
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                        {settings.aiTemperature}
                                    </span>
                                </div>
                                <Input
                                    type="range"
                                    name="aiTemperature"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    defaultValue={settings.aiTemperature}
                                    className="h-4"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>Précis & Factuel</span>
                                    <span>Équilibré</span>
                                    <span>Créatif & Varié</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 h-12 px-8 text-lg">
                            <Save className="mr-2 h-5 w-5" />
                            Sauvegarder la configuration
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
