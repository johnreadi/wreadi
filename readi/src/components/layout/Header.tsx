"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MenuItem {
  label?: string;
  name?: string;
  href: string;
  target?: string;
}

interface TopBarItem {
  type: string;
  content: string;
}

interface HeaderProps {
  settings?: {
    siteName: string;
    siteSlogan: string | null;
    siteLogo: string | null;
    primaryColor: string;
    headerBgColor?: string;
    headerTextColor?: string;
    headerFontSize?: string;
    topBarEnabled?: boolean;
    topBarBgColor?: string;
    topBarTextColor?: string;
    contactPhone?: string | null;
  } | null;
  menuItems?: MenuItem[];
  topBarItems?: TopBarItem[];
}

export function Header({ settings, menuItems = [], topBarItems = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const siteName = settings?.siteName || "READI";
  const primaryColor = settings?.primaryColor || "#dc2626";
  
  // Custom Styles
  const headerStyle = {
    backgroundColor: settings?.headerBgColor || "#ffffff",
    color: settings?.headerTextColor || "#1f2937",
    fontSize: settings?.headerFontSize || "16px",
  };

  const topBarStyle = {
    backgroundColor: settings?.topBarBgColor || "#000000",
    color: settings?.topBarTextColor || "#ffffff",
  };

  // Fallback menu if empty
  const navItems = menuItems.length > 0 ? menuItems : [
    { label: "Affichage Dynamique", href: "/affichage-dynamique" },
    { label: "Informatique & Maintenance", href: "/informatique-maintenance" },
    { label: "Pièces Détachées", href: "/pieces-detachees" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      {settings?.topBarEnabled && (
        <div style={topBarStyle} className="w-full py-2 px-4 text-xs font-bold">
          <div className="container mx-auto flex items-center justify-between">
            {topBarItems.map((item, idx) => (
              <div key={idx} className="flex items-center">
                {item.type === "TEXT" && <span>{item.content}</span>}
                {item.type === "SCROLL" && (
                  <div className="overflow-hidden whitespace-nowrap max-w-[300px] md:max-w-md lg:max-w-xl relative">
                    <div className="animate-marquee inline-block">{item.content}</div>
                  </div>
                )}
                {item.type === "IMAGE" && <img src={item.content} alt="TopBar Element" className="h-6 w-auto object-contain" />}
              </div>
            ))}
            {topBarItems.length === 0 && <span>Bienvenue sur {siteName}</span>}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ backgroundColor: headerStyle.backgroundColor }}>
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
                  <span className="text-xs font-medium" style={{ color: headerStyle.color, opacity: 0.7 }}>
                    {settings.siteSlogan}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label || item.name}
                  href={item.href}
                  target={item.target || "_self"}
                  className="font-semibold transition-colors relative group"
                  style={{ 
                    color: headerStyle.color,
                    fontSize: headerStyle.fontSize 
                  }}
                >
                  {item.label || item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: primaryColor }} />
                </Link>
              ))}
            </nav>

            {/* Phone & Mobile Menu */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${settings?.contactPhone?.replace(/\s/g, '') || "0235624046"}`}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 text-sm font-bold shadow-sm hover:shadow-md transition-all sm:bg-white"
                style={{ color: primaryColor }}
              >
                <Phone className="h-4 w-4" />
                {settings?.contactPhone || "02.35.62.40.46"}
              </a>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Menu className="h-6 w-6" style={{ color: headerStyle.color }} />
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
                      {navItems.map((item) => (
                        <Link
                          key={item.label || item.name}
                          href={item.href}
                          target={item.target || "_self"}
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
                        >
                          {item.label || item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
