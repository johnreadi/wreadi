import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Monitor, Zap, Eye, Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DynamicSection } from "@/components/layout/DynamicSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affichage Dynamique & Holographique 3D",
  description: "Boostez votre visibilité avec nos solutions d'affichage dynamique, bornes tactiles et technologie holographique 3D. Expert depuis 1994.",
  keywords: ["affichage dynamique", "hologramme 3d", "borne tactile", "écran publicitaire", "digital signage"],
};

async function getPageData() {
  const [category, pageContent] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: "affichage-dynamique" },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.pageContent.findUnique({
      where: { pageSlug: "affichage-dynamique" },
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

function safeJsonParse(jsonString: string | null | undefined, fallback: any = []) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return fallback;
  }
}

export default async function AffichageDynamiquePage() {
  const { category, pageContent } = await getPageData();
  const services = category?.services || [];

  const heroData = {
    title: pageContent?.heroTitle || "Affichage Dynamique",
    subtitle: pageContent?.heroSubtitle || "Innovation Visuelle",
    description: pageContent?.heroDescription || "Solutions d'affichage moderne et holographique pour votre entreprise",
    btnText: pageContent?.heroBtnText || "Demander un devis",
    btnLink: pageContent?.heroBtnLink || "/contact",
    image: pageContent?.heroImage || null,
    video: pageContent?.heroVideoUrl || null,
    bgColor: pageContent?.heroBgColor || null,
    // Font settings - Responsive defaults handled by Tailwind
    titleFontSize: pageContent?.titleFontSize || undefined,
    titleFontFamily: pageContent?.titleFontFamily || undefined,
    subtitleFontSize: pageContent?.subtitleFontSize || undefined,
    descriptionFontSize: pageContent?.descriptionFontSize || undefined,
  };

  return (
    <div className="flex flex-col">
      {/* Dynamic Hero */}
      <section 
        className="relative min-h-[50vh] md:h-[40vh] md:min-h-[400px] flex items-center justify-center overflow-hidden py-20 md:py-0"
        style={{ backgroundColor: heroData.bgColor || '#1e3a8a' }} // Default blue-900 equivalent
      >
        {heroData.video ? (
          <div className="absolute inset-0 z-0">
            {(heroData.video.startsWith('/') || heroData.video.match(/\.(mp4|webm|ogg)$/i)) ? (
                <video
                    src={heroData.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover grayscale-[20%]"
                />
            ) : (
                <iframe
                    src={`${heroData.video.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0`}
                    className="w-full h-full border-0 scale-150 grayscale-[20%]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            )}
          </div>
        ) : heroData.image ? (
          <div className="absolute inset-0 z-0">
            <Image 
                src={heroData.image} 
                alt="Hero background" 
                fill
                className="object-cover opacity-40 transition-transform duration-1000 hover:scale-105" 
                priority
                sizes="100vw"
            />
          </div>
        ) : (
          <div className="absolute inset-0 opacity-90" style={{ backgroundColor: heroData.bgColor || '#1e3a8a' }} />
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
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-auto min-h-[3.5rem] py-4 px-6 md:px-8 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-base md:text-lg whitespace-normal text-center leading-tight">
              <Link href={heroData.btnLink} className="flex items-center gap-2">
                <span>{heroData.btnText}</span>
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">
              Nos Solutions d'Affichage
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service) => (
              <Card key={service.id} className="group overflow-hidden border-2 border-gray-50 hover:border-blue-200 transition-all rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="h-64 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {service.image ? (
                    <img src={service.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : (
                    <Monitor className="h-20 w-20 text-blue-500/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-6 left-6 text-2xl font-black text-white group-hover:translate-x-2 transition-transform uppercase">{service.name}</h3>
                </div>
                <CardContent className="p-8 md:p-10">
                  <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed font-medium">{service.description}</p>
                  {service.features && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {safeJsonParse(service.features).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-700 bg-blue-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-blue-100/50">
                          <Zap className="h-4 w-4 text-blue-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Sections from CMS */}
      {pageContent?.sections.map((section) => (
        <DynamicSection key={section.id} section={section as any} />
      ))}

      {/* 3D Holographique Highlight */}
      <section className="py-20 bg-gray-950 text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-blue-600 text-white mb-6 uppercase tracking-widest px-4 py-1 rounded-full border-none font-black text-[10px]">Exclusivité READI</Badge>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-200 leading-tight">
                3D Holographique
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium max-w-xl">
                L'image flotte dans l'espace. Un système de ventilation LED révolutionnaire pour captiver votre audience immédiatement.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-lg font-black italic">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400"><Eye className="h-5 w-5" /></div>
                  Effet de flottabilité spectaculaire
                </div>
                <div className="flex items-center gap-4 text-lg font-black italic text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Zap className="h-5 w-5" /></div>
                  Installation plug & play rapide
                </div>
              </div>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl font-black text-base transition-all hover:scale-105">
                <Link href="/contact">En savoir plus</Link>
              </Button>
            </div>
            <div className="relative aspect-square rounded-[3.5rem] border-8 border-white/5 bg-gradient-to-br from-blue-900/40 via-black to-black overflow-hidden flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.2)]">
              <Sparkles className="h-32 w-32 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
