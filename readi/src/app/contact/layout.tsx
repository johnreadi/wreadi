import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact & Devis Gratuit",
    description: "Contactez READI pour tous vos projets d'affichage dynamique, maintenance informatique ou pièces détachées. Devis gratuit et intervention rapide.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
