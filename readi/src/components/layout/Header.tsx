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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-600">READI</span>
            <span className="hidden sm:inline text-sm text-gray-500">.FR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Phone & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href="tel:0235624046"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Phone className="h-4 w-4" />
              02.35.62.40.46
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-red-600 transition-colors py-2 border-b"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <a
                    href="tel:0235624046"
                    className="flex items-center gap-2 text-lg font-medium text-red-600 mt-4"
                  >
                    <Phone className="h-5 w-5" />
                    02.35.62.40.46
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
