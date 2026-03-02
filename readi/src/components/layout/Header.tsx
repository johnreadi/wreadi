"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Affichage Dynamique", href: "/affichage-dynamique" },
  { name: "Informatique & Maintenance", href: "/informatique-maintenance" },
  { name: "Pièces Détachées", href: "/pieces-detachees" },
  { name: "Contact", href: "/contact" },
];

interface HeaderProps {
  settings?: {
    siteName: string;
    siteSlogan: string | null;
    siteLogo: string | null;
    primaryColor: string;
  } | null;
}

export function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const siteName = settings?.siteName || "READI";
  const primaryColor = settings?.primaryColor || "#dc2626";

  // Debug log pour voir ce qui arrive dans le composant client
  console.log("Header settings:", settings);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3">
            {settings?.siteLogo ? (
              <img
                src={settings.siteLogo}
                alt={siteName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-2xl font-extrabold tracking-tighter" style={{ color: primaryColor }}>
                  {siteName}
                </span>
                {!settings?.siteName && <span className="hidden sm:inline text-sm text-gray-400 font-bold">.FR</span>}
              </div>
            )}

            {settings?.siteSlogan && (
              <div className="hidden xl:flex flex-col border-l pl-3 border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {settings.siteSlogan}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-600 hover:text-[var(--primary-color)] transition-colors relative group"
                style={{ '--primary-color': primaryColor } as any}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-color)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Phone & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="tel:0235624046"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 text-sm font-bold shadow-sm hover:shadow-md transition-all sm:bg-white"
              style={{ color: primaryColor }}
            >
              <Phone className="h-4 w-4" />
              02.35.62.40.46
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full py-6">
                  <div className="mb-8 px-4">
                    <span className="text-2xl font-black" style={{ color: primaryColor }}>{siteName}</span>
                    <p className="text-xs text-gray-500 mt-1">{settings?.siteSlogan}</p>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-xl transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t px-4">
                    <a
                      href="tel:0235624046"
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl text-white font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Phone className="h-5 w-5" />
                      Appeler READI
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
