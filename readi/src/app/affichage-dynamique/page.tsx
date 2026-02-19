import Link from "next/link";
import { ArrowRight, Monitor, Sparkles, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

import { Service } from "@prisma/client";

async function getServices(): Promise<Service[]> {
  const category = await prisma.category.findUnique({
    where: { slug: "affichage-dynamique" },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return category?.services || [];
}

export default async function AffichageDynamiquePage() {
  const services = await getServices();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Affichage Dynamique
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Solutions d&apos;affichage moderne et holographique pour votre entreprise
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/contact">
                Demander un devis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Solutions d&apos;Affichage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des technologies innovantes pour communiquer efficacement avec votre audience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Monitor className="h-20 w-20 text-blue-600" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="text-base">
                    {service.shortDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-2">
                      {JSON.parse(service.features).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="h-4 w-4 text-blue-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Holographique Highlight */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Technologie innovante
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                3D Holographique
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                L&apos;image flotte dans l&apos;espace
              </p>
              <p className="text-gray-400 mb-8">
                C&apos;est un système de ventilation des LEDs qui donne l&apos;illusion de flottabilité 
                des objets dans l&apos;espace. Très simple à mettre en place et moins coûteux. 
                Par contre, il faut avoir une petite compétence dans la réalisation des vidéos et des maquettes.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm">Effet spectaculaire</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm">Installation simple</span>
                </div>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  En savoir plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="h-32 w-32 mx-auto mb-4 text-blue-400 animate-pulse" />
                <p className="text-lg text-gray-400">Visualisation 3D Holographique</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Transformez votre communication visuelle
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Découvrez comment l&apos;affichage dynamique peut moderniser votre entreprise.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/contact">
              Demander une démonstration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
