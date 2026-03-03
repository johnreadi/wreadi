"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Affichage Dynamique", href: "/affichage-dynamique" },
  { name: "Informatique & Maintenance", href: "/informatique-maintenance" },
  { name: "Pièces Détachées", href: "/pieces-detachees" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "Affichage Dynamique", href: "/affichage-dynamique" },
  { name: "3D Holographique", href: "/affichage-dynamique" },
  { name: "Imprimantes", href: "/informatique-maintenance" },
  { name: "Copieurs", href: "/informatique-maintenance" },
  { name: "Développement Web", href: "/informatique-maintenance" },
];

interface FooterProps {
  settings?: any;
}

export function Footer({ settings }: FooterProps) {
  const address = settings?.contactAddress || "123 Rue de l'Informatique\n76000 Rouen, France";
  const addressLines = address.split('\n');

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {settings?.siteName || "READI"}<span className="text-red-500">.FR</span>
            </h3>
            <p className="text-sm mb-4">
              {settings?.siteSlogan || "Pro depuis 1994. Votre partenaire informatique de confiance."}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-red-500" />
              <span>{settings?.contactHours?.split('\n')[0] || "Lun-Ven: 9h-18h"}</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Nos Services</h4>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings?.contactPhone || '0235624046'}`}
                  className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {settings?.contactPhone || "02.35.62.40.46"}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings?.contactEmail || 'contact@readi.fr'}`}
                  className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {settings?.contactEmail || "contact@readi.fr"}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {addressLines.map((line: string, i: number) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || "READI.FR"} - Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4 items-center">

            <Dialog>
              <DialogTrigger className="hover:text-red-500 transition-colors pointer-events-auto">
                Confidentialité
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black mb-4">Politique de Confidentialité</DialogTitle>
                </DialogHeader>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed flex-1 overflow-y-auto pr-2">
                  {settings?.privacyPolicy || "Contenu de la politique de confidentialité à définir."}
                </div>
              </DialogContent>
            </Dialog>

            <span className="text-gray-600 hidden md:inline">|</span>

            <Dialog>
              <DialogTrigger className="hover:text-red-500 transition-colors pointer-events-auto">
                Conditions Générales
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black mb-4">Conditions Générales d'Utilisation</DialogTitle>
                </DialogHeader>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed flex-1 overflow-y-auto pr-2">
                  {settings?.termsOfService || "Contenu des conditions générales à définir."}
                </div>
              </DialogContent>
            </Dialog>

            <span className="text-gray-600 hidden md:inline">|</span>

            <Link href="/login-admin" className="hover:text-red-500 transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
