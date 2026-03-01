import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Layout } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function getPageContent() {
    let content = await prisma.pageContent.findUnique({
        where: { pageSlug: "pieces-detachees" },
    });

    if (!content) {
        content = await prisma.pageContent.create({
            data: {
                pageSlug: "pieces-detachees",
                heroTitle: "Pièces Détachées & Catalogues",
                heroSubtitle: "Trouvez vos composants via notre configurateur ou nos portails partenaires officiels.",
                heroDescription: "Accédez à notre guide produit complet en partenariat avec EET Group pour trouver précisément vos pièces détachées.",
                heroBtnText: "Notre Configurateur",
                heroBtnLink: "#configurateur",
            },
        });
    }

    return content;
}

export default async function AdminPiecesContentPage() {
    const content = await getPageContent();

    async function updateHero(formData: FormData) {
        "use server";

        const heroTitle = formData.get("heroTitle") as string;
        const heroSubtitle = formData.get("heroSubtitle") as string;
        const heroDescription = formData.get("heroDescription") as string;

        await prisma.pageContent.update({
            where: { pageSlug: "pieces-detachees" },
            data: {
                heroTitle,
                heroSubtitle,
                heroDescription,
            },
        });

        revalidatePath("/pieces-detachees");
        revalidatePath("/admin/content/pieces-detachees");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Modification : Pièces Détachées</h1>
            </div>

            <form action={updateHero}>
                <div className="grid gap-6">
                    <Card className="border-2 border-orange-100">
                        <CardHeader className="bg-orange-50/50">
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="h-5 w-5 text-orange-600" />
                                Section Hero (Haut de page)
                            </CardTitle>
                            <CardDescription>
                                Modifiez le titre, le sous-titre et le texte d'accroche.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="heroTitle">Titre Principal</Label>
                                <Input
                                    id="heroTitle"
                                    name="heroTitle"
                                    defaultValue={content.heroTitle || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heroSubtitle">Sous-titre (dans le Hero)</Label>
                                <Input
                                    id="heroSubtitle"
                                    name="heroSubtitle"
                                    defaultValue={content.heroSubtitle || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heroDescription">Description du catalogue (sous le titre)</Label>
                                <Textarea
                                    id="heroDescription"
                                    name="heroDescription"
                                    rows={3}
                                    defaultValue={content.heroDescription || ""}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 h-12 px-8">
                            <Save className="mr-2 h-5 w-5" />
                            Publier les modifications
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
