import Link from "next/link";
import { ArrowRight, Monitor, Settings, Package, GraduationCap, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getData() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  return { categories, testimonials };
}

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="h-8 w-8" />,
  Settings: <Settings className="h-8 w-8" />,
  Package: <Package className="h-8 w-8" />,
  GraduationCap: <GraduationCap className="h-8 w-8" />,
};

export default async function HomePage() {
  const { categories, testimonials } = await getData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-200 font-medium mb-4">Pro depuis 1994</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              SERVICE DU PRO...
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-4">
              READI.FR c&apos;est : <span className="font-bold text-yellow-300">La Compétence !</span>
            </p>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Nous intervenons sur site ou à distance avec nos clients. 
              Effectuons les travaux sur acceptation du devis préalablement établi 
              d&apos;après nos tarifs et conditions légales de vente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-red-50">
                <Link href="/contact">
                  Demander un devis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/affichage-dynamique">
                  Découvrir nos services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos domaines de services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des solutions complètes pour répondre à tous vos besoins informatiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-red-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                      {iconMap[category.icon || "Monitor"]}
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi choisir READI.FR ?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                    <span className="text-xl font-bold">30+</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Années d&apos;expérience</h3>
                    <p className="text-gray-600">Depuis 1994, nous accompagnons nos clients avec expertise et professionnalisme.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Intervention sur site</h3>
                    <p className="text-gray-600">Nous nous déplaçons chez vous pour résoudre vos problèmes informatiques.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Pièces d&apos;origine</h3>
                    <p className="text-gray-600">Nous utilisons uniquement des pièces détachées de qualité pour nos réparations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Monitor className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg">Illustration services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-gray-400">
              La satisfaction de nos clients est notre priorité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Quote className="h-8 w-8 text-red-500 mb-4" />
                  <CardDescription className="text-gray-300 text-base">
                    &ldquo;{testimonial.content}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-red-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre affichage ?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès maintenant pour un devis gratuit et personnalisé.
          </p>
          <Button asChild size="lg" className="bg-white text-red-600 hover:bg-red-50">
            <Link href="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
