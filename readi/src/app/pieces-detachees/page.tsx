import Link from "next/link";
import { ArrowRight, Package, Settings, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { PiecesConfigurator } from "@/components/pieces/PiecesConfigurator";
import { Metadata } from "next";
import { DynamicSection } from "@/components/layout/DynamicSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pièces Détachées Informatiques & Catalogues",
  description: "Catalogue complet de pièces détachées informatiques, câbles et composants. Accès aux guides produits officiels EET Group et configurateur personnalisé.",
  keywords: ["pièces détachées informatique", "câbles ordinateur", "composants pc", "catalogue constructeur", "eet group"],
};

async function getPageData() {
  const [pageContent, products] = await Promise.all([
    // @ts-ignore
    prisma.pageContent.findUnique({
      where: { pageSlug: "pieces-detachees" },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { pageContent, products };
}

export default async function PiecesDetacheesPage() {
  const { pageContent, products } = await getPageData();

  const heroData = {
    title: pageContent?.heroTitle || "Pièces Détachées & Catalogues",
    subtitle: pageContent?.heroSubtitle || "Solutions Composants",
    description: pageContent?.heroDescription || "Trouvez vos composants via notre configurateur ou nos portails partenaires officiels.",
    btnText: pageContent?.heroBtnText || "Accéder au catalogue",
    btnLink: pageContent?.heroBtnLink || "#catalogues",
    image: pageContent?.heroImage || null,
    video: pageContent?.heroVideoUrl || null,
    bgColor: pageContent?.heroBgColor || "#7c2d12", // orange-900 default
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
        style={{ backgroundColor: heroData.bgColor }}
      >
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
          <div className="absolute inset-0 opacity-90" style={{ backgroundColor: heroData.bgColor }} />
        )}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="container relative z-20 mx-auto px-4 text-center text-white">
          <span
            className="inline-block px-3 py-1 rounded-full bg-orange-500/20 backdrop-blur-md font-bold uppercase tracking-widest mb-6 border border-white/10 text-[10px] sm:text-xs"
            style={{ fontSize: heroData.subtitleFontSize }}
          >
            {heroData.subtitle}
          </span>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter uppercase"
            style={{
              fontSize: heroData.titleFontSize,
              fontFamily: heroData.titleFontFamily
            }}
          >
            {heroData.title}
          </h1>
          <p
            className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto font-medium"
            style={{ fontSize: heroData.descriptionFontSize }}
          >
            {heroData.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-in fade-in zoom-in-95 duration-1000">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50 h-auto min-h-[3.5rem] py-4 px-6 md:px-8 rounded-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 text-base md:text-lg whitespace-normal text-center leading-tight">
              <Link href={heroData.btnLink} className="flex items-center gap-2">
                <span>{heroData.btnText}</span>
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-auto min-h-[3.5rem] py-4 px-6 md:px-8 rounded-2xl font-black backdrop-blur-sm text-base md:text-lg whitespace-normal text-center leading-tight">
              <Link href="#configurateur">
                Configurateur
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Globe className="h-8 w-8 text-orange-600 mb-3" />
              <span className="text-sm font-black uppercase text-gray-500">Expédition France</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-8 w-8 text-orange-600 mb-3" />
              <span className="text-sm font-black uppercase text-gray-500">Garantie Constructeur</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Settings className="h-8 w-8 text-orange-600 mb-3" />
              <span className="text-sm font-black uppercase text-gray-500">Support Technique</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Package className="h-8 w-8 text-orange-600 mb-3" />
              <span className="text-sm font-black uppercase text-gray-500">+100k Références</span>
            </div>
          </div>
        </div>
      </section>

      {/* External Catalogues / IFrames Section */}
      <section id="catalogues" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Portail Partenaire Officiel</h2>
            <div className="w-20 h-1 bg-orange-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-16">
            {/* Guide Produit Interactif Iframe */}
            <Card className="overflow-hidden border-4 border-orange-50 shadow-[0_32px_64px_-16px_rgba(234,88,12,0.15)] rounded-[2.5rem]">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 md:p-8 border-b flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-orange-900 mb-1 tracking-tight">Catalogue Général Officiel</h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium">Recherchez par marque, catégorie ou référence constructeur</p>
                </div>
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-xs font-black rounded-full border-none shadow-lg shadow-orange-600/20">
                  CATALOGUE PRODUITS
                </Badge>
              </div>
              <CardContent className="p-0 bg-gray-50 min-h-[700px] relative">
                <iframe
                  src="https://www.eetgroup.com/fr-fr/external-guides/productguide?externalId=855948f7-0461-4b48-b2d6-1ab51285adc7&guideId=all"
                  width="100%"
                  height="800"
                  className="w-full border-0"
                  title="Catalogue Général EET Group"
                  loading="lazy"
                  allowFullScreen
                />
              </CardContent>
            </Card>

            {/* Nouveau Guide Câbles Iframe */}
            <Card className="overflow-hidden border-4 border-slate-50 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] rounded-[2.5rem]">
              <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 md:p-8 border-b flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 tracking-tight">Configuration de Câblage</h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium">Trouvez le câble exact compatible avec votre matériel ou votre installation</p>
                </div>
                <Badge className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 text-xs font-black rounded-full border-none shadow-lg shadow-slate-800/20">
                  CATALOGUE CÂBLES
                </Badge>
              </div>
              <CardContent className="p-0 bg-gray-50 min-h-[700px] relative">
                <iframe
                  src="https://www.eetgroup.com/fr-fr/external-guides/productguide?externalId=fbb885a1-d180-4a3f-911b-6c35504b3862&guideId=cable"
                  width="100%"
                  height="800"
                  className="w-full border-0"
                  title="Catalogue Câbles EET Group"
                  loading="lazy"
                  allowFullScreen
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Sections from CMS */}
      {pageContent?.sections?.map((section: any) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      {/* Logic Configurator (Client Component) */}
      <section id="configurateur" className="py-12">
        <PiecesConfigurator initialProducts={products} />
      </section>
    </div>
  );
}
