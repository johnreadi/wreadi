import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, GraduationCap, Laptop, Code, MonitorSpeaker, CheckCircle2, Layout, BookOpen
} from "lucide-react";
import Link from "next/link";
import { DynamicSection } from "@/components/layout/DynamicSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Formation & Création Web | READI.FR",
    description: "Création de sites internet sur mesure, applications métier et formation professionnelle à l'utilisation des outils numériques.",
    keywords: ["création site web", "formation digitale", "agence web", "développement informatique", "formation entreprise"],
};

async function getPageData() {
    const [category, pageContent] = await Promise.all([
        prisma.category.findUnique({
            where: { slug: "formation-web" },
            include: {
                services: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                },
            },
        }),
        // @ts-ignore
        prisma.pageContent.findUnique({
            where: { pageSlug: "formation-web" },
            include: {
                sections: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                },
            },
        }),
    ]);
    return { category, pageContent };
}

const iconMap: Record<string, any> = {
    GraduationCap: GraduationCap,
    Laptop: Laptop,
    Code: Code,
    MonitorSpeaker: MonitorSpeaker,
    Layout: Layout,
    BookOpen: BookOpen,
};

export default async function FormationWebPage() {
    const { category, pageContent } = await getPageData();
    const services = category?.services || [];

    const heroData = {
        title: pageContent?.heroTitle || "Création Web & Formation",
        subtitle: pageContent?.heroSubtitle || "Votre présence digitale",
        description: pageContent?.heroDescription || "Conception de sites vitrines professionnels et formations aux outils numériques pour vous rendre autonome.",
        btnText: pageContent?.heroBtnText || "Parler de votre projet",
        btnLink: pageContent?.heroBtnLink || "/contact",
        image: pageContent?.heroImage || null,
        video: pageContent?.heroVideoUrl || null,
        titleFontSize: pageContent?.titleFontSize || "3.5rem",
        titleFontFamily: pageContent?.titleFontFamily || "inherit",
        subtitleFontSize: pageContent?.subtitleFontSize || "0.75rem",
        descriptionFontSize: pageContent?.descriptionFontSize || "1.125rem",
    };

    return (
        <div className="flex flex-col">
            {/* Dynamic Hero */}
            <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-blue-900">
                {heroData.video ? (
                    <div className="absolute inset-0 z-0">
                        <iframe
                            src={`${heroData.video.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0`}
                            className="w-full h-full border-0 scale-150 grayscale-[20%]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                ) : heroData.image ? (
                    <div className="absolute inset-0 z-0">
                        <img src={heroData.image} alt="" className="w-full h-full object-cover opacity-40 transition-transform duration-1000 hover:scale-105" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90" />
                )}
                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="container relative z-20 mx-auto px-4 text-center text-white">
                    <span
                        className="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md font-bold uppercase tracking-widest mb-6 border border-white/10 text-[10px] sm:text-xs"
                        style={{ fontSize: heroData.subtitleFontSize }}
                    >
                        {heroData.subtitle}
                    </span>
                    <h1
                        className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 uppercase"
                        style={{
                            fontSize: heroData.titleFontSize,
                            fontFamily: heroData.titleFontFamily
                        }}
                    >
                        {heroData.title}
                    </h1>
                    <p
                        className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000"
                        style={{ fontSize: heroData.descriptionFontSize }}
                    >
                        {heroData.description}
                    </p>
                    <div className="animate-in fade-in zoom-in-95 duration-1000">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-base">
                            <Link href={heroData.btnLink}>
                                {heroData.btnText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Compétences & Formations</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const Icon = iconMap[service.icon || "GraduationCap"] || GraduationCap;
                            return (
                                <Card key={service.id} className="group hover:border-blue-600 transition-all border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 rounded-[2rem] p-8 flex flex-col">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-blue-100">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-black mb-4 group-hover:text-blue-600 transition-colors uppercase">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-500 text-base md:text-lg mb-6 flex-1 leading-relaxed">
                                        {service.description}
                                    </p>
                                    {service.features && (
                                        <div className="space-y-2 pt-6 border-t border-gray-100">
                                            {JSON.parse(service.features).slice(0, 3).map((f: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-600">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Dynamic Sections from CMS */}
            {pageContent?.sections?.map((section: any) => (
                <DynamicSection key={section.id} section={section} />
            ))}

            {/* Contact Call-to-action Section */}
            <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-700 -skew-x-12 translate-x-1/4 opacity-50" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-2xl md:text-4xl font-black mb-6 tracking-tighter uppercase">Envie de concrétiser votre idée ?</h2>
                    <p className="text-lg text-blue-100 mb-10 max-w-3xl mx-auto font-medium">
                        Contactez-nous pour la conception de votre site internet ou pour organiser une session de formation personnalisée selon vos besoins.
                    </p>
                    <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-10 rounded-2xl font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95">
                        <Link href="/contact">
                            Démarrer le projet
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
