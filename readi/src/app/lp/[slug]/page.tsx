import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Megaphone, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function LandingPage({ params }: { params: { slug: string } }) {
    // @ts-ignore
    const page = await prisma.landingPage.findUnique({
        where: { slug: params.slug }
    });

    if (!page || !page.isActive) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-[50vh] md:h-[40vh] md:min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 py-20 md:py-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <Badge variant="outline" className="mb-6 px-4 py-1 border-purple-200 text-purple-700 bg-purple-50/50">
                                <Megaphone className="h-4 w-4 mr-2" />
                                Offre Exclusive : {page.title}
                            </Badge>

                            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-purple-600 to-blue-600">
                                {page.heroTitle || page.title}
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
                                {page.heroSubtitle || page.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="h-auto min-h-[3.5rem] py-4 px-8 text-base md:text-lg bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-200 rounded-full whitespace-normal text-center leading-tight" asChild>
                                    <Link href="/contact" className="flex items-center gap-2">
                                        <span>Demander un devis gratuit</span>
                                        <ArrowRight className="h-5 w-5 flex-shrink-0" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-auto min-h-[3.5rem] py-4 px-8 text-base md:text-lg rounded-full whitespace-normal text-center leading-tight" asChild>
                                    <Link href="/services">
                                        Voir nos réalisations
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Expertise depuis 1994
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Support technique premium
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Garantie constructeur
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section (Simulated for now, could be dynamic later) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto prose prose-lg prose-purple">
                            {page.content ? (
                                <div dangerouslySetInnerHTML={{ __html: page.content }} />
                            ) : (
                                <div className="text-center space-y-8">
                                    <h2 className="text-3xl font-bold">Pourquoi choisir READI pour {page.title} ?</h2>
                                    <p className="text-gray-600">
                                        Nous accompagnons les professionnels dans la mise en place de solutions d'affichage dynamique
                                        interactives et performantes. Que ce soit pour une installation temporaire ou permanente,
                                        notre équipe technique s'occupe de tout.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
                                        <div className="p-6 bg-gray-50 rounded-2xl">
                                            <h3 className="text-lg font-bold mb-2">Installation Clés en main</h3>
                                            <p className="text-sm text-gray-500">Montage, configuration et formation de vos équipes sur place.</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-2xl">
                                            <h3 className="text-lg font-bold mb-2">Matériel Haute Qualité</h3>
                                            <p className="text-sm text-gray-500">Écrans haute luminosité et bornes tactiles dernière génération.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="py-20 bg-purple-900 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl lg:text-5xl font-bold mb-8">Prêt à booster votre communication ?</h2>
                        <p className="text-purple-200 mb-10 text-xl max-w-2xl mx-auto">
                            Ne manquez pas cette opportunité. Nos experts sont à votre disposition pour analyser votre besoin et vous proposer la solution idéale.
                        </p>
                        <Button size="lg" variant="secondary" className="h-14 px-12 text-lg rounded-full" asChild>
                            <Link href="/contact">Contactez-nous aujourd'hui</Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

// Layout helper
function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${variant === "outline" ? "border-gray-200 border" : "bg-primary text-primary-foreground"} ${className}`}>
            {children}
        </span>
    );
}
