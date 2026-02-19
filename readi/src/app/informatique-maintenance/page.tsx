import Link from "next/link";
import { ArrowRight, Printer, Copy, ScanLine, Monitor, Antenna, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Service } from "@prisma/client";

async function getServices(): Promise<Service[]> {
  const category = await prisma.category.findUnique({
    where: { slug: "informatique-maintenance" },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return category?.services || [];
}

const iconMap: Record<string, React.ReactNode> = {
  Printer: <Printer className="h-8 w-8" />,
  Copy: <Copy className="h-8 w-8" />,
  ScanLine: <ScanLine className="h-8 w-8" />,
  Monitor: <Monitor className="h-8 w-8" />,
  Antenna: <Antenna className="h-8 w-8" />,
  Globe: <Globe className="h-8 w-8" />,
};

export default async function InformatiqueMaintenancePage() {
  const services = await getServices();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-teal-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Maintenance & Installation
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Services professionnels d&apos;informatique et maintenance sur site
            </p>
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <Link href="/contact">
                Demander une intervention
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Services de Maintenance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Intervention sur site pour tous vos équipements informatiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: Service) => (
              <Card key={service.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    {iconMap[service.icon || "Monitor"]}
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-1">
                      {JSON.parse(service.features).slice(0, 3).map((feature: string, index: number) => (
                        <li key={index} className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
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

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d&apos;une intervention rapide ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Nous intervenons sur site sans embarquer votre matériel. Devis transparent avec déplacement inclus.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
            <Link href="/contact">
              Contactez-nous maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
