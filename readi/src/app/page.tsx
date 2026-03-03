import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Monitor, Settings, Package, GraduationCap
} from "lucide-react";
import Link from "next/link";
import { DynamicSection } from "@/components/layout/DynamicSection";

async function getData() {
  try {
    const [categories, testimonials, pageContent] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.pageContent.findUnique({
        where: { pageSlug: "home" },
        include: {
          sections: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      }),
    ]);

    return { categories, testimonials, pageContent };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return { categories: [], testimonials: [], pageContent: null };
  }
}

export default async function HomePage() {
  const { categories, testimonials, pageContent } = await getData();

  const heroData = {
    title: pageContent?.heroTitle || "SERVICE DU PRO...",
    subtitle: pageContent?.heroSubtitle || "Pro depuis 1994",
    description: pageContent?.heroDescription || "READI.FR c'est : La Compétence !",
    btnText: pageContent?.heroBtnText || "Demander un devis",
    btnLink: pageContent?.heroBtnLink || "/contact",
    image: pageContent?.heroImage || null,
    video: pageContent?.heroVideoUrl || null,
    bgColor: pageContent?.heroBgColor || "#000000",
    // Font settings - Responsive defaults handled by Tailwind
    titleFontSize: pageContent?.titleFontSize || undefined,
    titleFontFamily: pageContent?.titleFontFamily || undefined,
    subtitleFontSize: pageContent?.subtitleFontSize || undefined,
    descriptionFontSize: pageContent?.descriptionFontSize || undefined,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section Dynamic */}
      <section 
        className="relative min-h-[50vh] md:h-[40vh] md:min-h-[400px] flex items-center justify-center overflow-hidden py-20 md:py-0"
        style={{ backgroundColor: heroData.bgColor }}
      >
        {heroData.video ? (
          <div className="absolute inset-0 z-0 opacity-60">
            <iframe
              src={`${heroData.video.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&playlist=${heroData.video.split('v=')[1] || ''}`}
              className="w-full h-[120%] -translate-y-[10%] border-0 scale-125"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : heroData.image ? (
          <div className="absolute inset-0 z-0">
            <img
              src={heroData.image}
              alt="Hero background"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-60" style={{ backgroundColor: heroData.bgColor }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />

        <div className="container relative z-20 mx-auto px-4 text-center text-white">
          <div
            className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm font-black uppercase tracking-[0.3em] mb-6 text-xs md:text-sm"
            style={{ fontSize: heroData.subtitleFontSize }}
          >
            {heroData.subtitle}
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700"
            style={{
              fontSize: heroData.titleFontSize,
              fontFamily: heroData.titleFontFamily
            }}
          >
            {heroData.title}
          </h1>
          <p
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ fontSize: heroData.descriptionFontSize }}
          >
            {heroData.description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-in fade-in zoom-in-95 duration-1000">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 h-auto min-h-[3.5rem] py-4 px-6 md:px-10 rounded-2xl text-base md:text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95 whitespace-normal text-center leading-tight">
              <Link href={heroData.btnLink} className="flex items-center gap-2">
                <span>{heroData.btnText}</span>
                <ArrowRight className="h-6 w-6 flex-shrink-0" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-auto min-h-[3.5rem] py-4 px-6 md:px-10 rounded-2xl text-base md:text-lg font-black backdrop-blur-sm whitespace-normal text-center leading-tight">
              <Link href="/affichage-dynamique">
                Nos solutions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4 uppercase">L'Univers READI</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Plus de 30 ans d'excellence technologique à votre service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category: any) => (
              <Card
                key={category.id}
                className="group hover:border-red-600 transition-all border-2 border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-red-600/10 rounded-3xl overflow-hidden p-8 flex flex-col"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-red-50">
                  {category.slug === 'affichage-dynamique' && <Monitor className="h-8 w-8" />}
                  {category.slug === 'informatique-maintenance' && <Settings className="h-8 w-8" />}
                  {category.slug === 'pieces-detachees' && <Package className="h-8 w-8" />}
                  {category.slug === 'formation-web' && <GraduationCap className="h-8 w-8" />}
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-red-600 transition-colors uppercase">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-base mb-6 flex-1 leading-relaxed">
                  {category.description}
                </p>
                <Button asChild variant="ghost" className="justify-start p-0 h-auto font-black hover:bg-transparent hover:text-red-700 text-red-600 gap-2 items-center text-base">
                  <Link href={`/${category.slug}`}>
                    Découvrir l'univers
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Sections from CMS */}
      {pageContent?.sections?.map((section: any) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 uppercase">Ce que nos clients disent</h2>
              <p className="text-lg text-gray-500 mt-2 leading-relaxed">Une satisfaction client bâtie sur des décennies de confiance.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any) => (
              <Card key={testimonial.id} className="p-8 border-none bg-white rounded-3xl shadow-xl shadow-gray-200/50">
                <div className="flex gap-1 mb-6">
                  <div className="text-yellow-400 font-bold">★★★★★</div>
                </div>
                <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4 border-t pt-6">
                  {testimonial.image ? (
                    <img src={testimonial.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-red-600 font-bold uppercase tracking-wider">{testimonial.company}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
