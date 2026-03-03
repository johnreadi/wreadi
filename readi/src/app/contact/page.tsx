import { prisma } from "@/lib/prisma";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contactez READI.FR | Expertise Informatique & Affichage Dynamique",
  description: "Contactez notre équipe pour vos projets informatiques, maintenance sur site ou solutions d'affichage dynamique. Basés à Rouen, intervenant partout en France.",
};

async function getContactData() {
  const pageContent = await prisma.pageContent.findUnique({
    where: { pageSlug: "contact" },
  }) as any;

  // On utilise queryRaw pour contourner le cache en mémoire du client Prisma 
  // et s'assurer qu'on récupère bien les derniers champs ajoutés (contactAddress, etc.)
  let settings = null;
  try {
    const settingsArray = await prisma.$queryRawUnsafe('SELECT * FROM SiteSettings WHERE id = "default"') as any[];
    settings = settingsArray?.[0] || null;
  } catch (e) {
    settings = await prisma.siteSettings.findUnique({ where: { id: "default" } }) as any;
  }

  return { pageContent, settings };
}

export default async function ContactPage() {
  const { pageContent, settings } = await getContactData();

  const heroData = {
    title: pageContent?.heroTitle || "Contactez-nous",
    subtitle: pageContent?.heroSubtitle || "Innovation & Proximité",
    description: pageContent?.heroDescription || "Une question ? Un projet ? Nous sommes là pour vous aider.",
    formTitle: pageContent?.heroBtnText || "Envoyez-nous un message",
    formDescription: pageContent?.heroBtnLink || "Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
    successTitle: "Message envoyé !",
    successMessage: "Merci de nous avoir contacté. Nous vous répondrons rapidement.",
    // Font settings - Responsive defaults handled by Tailwind
    titleFontSize: pageContent?.titleFontSize || undefined,
    titleFontFamily: pageContent?.titleFontFamily || undefined,
    subtitleFontSize: pageContent?.subtitleFontSize || undefined,
    descriptionFontSize: pageContent?.descriptionFontSize || undefined,
  };

  // Helper for address display (preserves newlines)
  const address = settings?.contactAddress || "123 Rue de l'Informatique\n76000 Rouen, France";
  const addressLines = address.split('\n');

  // Helper for hours (handles splits if needed, but here we just show the string)
  const hours = settings?.contactHours || "Lundi - Vendredi\n9h00 - 18h00";
  const hoursLines = hours.split('\n');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:h-[40vh] md:min-h-[400px] flex items-center justify-center overflow-hidden bg-red-900 py-20 md:py-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800 opacity-90" />
        <div className="absolute inset-0 bg-black/20 z-10" />

        <div className="container relative z-20 mx-auto px-4 text-center text-white">
          <span
            className="inline-block px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md font-bold uppercase tracking-widest mb-6 border border-white/10 text-[10px] sm:text-xs"
            style={{ fontSize: heroData.subtitleFontSize }}
          >
            {heroData.subtitle}
          </span>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter uppercase leading-tight"
            style={{
              fontSize: heroData.titleFontSize,
              fontFamily: heroData.titleFontFamily
            }}
          >
            {heroData.title}
          </h1>
          <p
            className="text-lg text-red-100 max-w-2xl mx-auto font-medium"
            style={{ fontSize: heroData.descriptionFontSize }}
          >
            {heroData.description}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form Component */}
            <ContactForm
              title={heroData.formTitle}
              description={heroData.formDescription}
              successTitle={heroData.successTitle}
              successMessage={heroData.successMessage}
            />

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Nos Coordonnées</h2>
                <div className="w-16 h-1 bg-red-600 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase">Téléphone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href={`tel:${settings?.contactPhone || '0235624046'}`} className="text-lg text-gray-600 hover:text-red-600 font-bold transition-colors">
                      {settings?.contactPhone || "02.35.62.40.46"}
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase">Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href={`mailto:${settings?.contactEmail || 'contact@readi.fr'}`} className="text-lg text-gray-600 hover:text-red-600 font-bold transition-colors break-all">
                      {settings?.contactEmail || "contact@readi.fr"}
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all group md:col-span-2">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-8 flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <MapPin className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-black uppercase">Adresse</h3>
                      </div>
                      <div className="text-gray-600 font-medium text-lg">
                        {addressLines.map((line: string, i: number) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 flex-1 bg-gray-50/50">
                      <div className="flex items-center gap-4 mb-4">
                        <Clock className="h-6 w-6 text-red-600" />
                        <h3 className="text-xl font-black uppercase">Horaires</h3>
                      </div>
                      <div className="text-gray-600 font-medium text-lg">
                        {hoursLines.map((line: string, i: number) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Interactive OpenStreetMap */}
              <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl h-80 relative group">
                <ContactMap address={address} />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
