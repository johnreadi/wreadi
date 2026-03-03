import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
export const dynamic = "force-dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { ChatBot } from "@/components/chat/ChatBot";
import { BackToTop } from "@/components/layout/BackToTop";
import { JsonLd } from "@/components/seo/JsonLd";
import { prisma } from "@/lib/prisma";
import { getMenuItems, getTopBarItems } from "@/app/admin/settings/menu-actions";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://readi.fr'),
  title: {
    default: "READI.FR - Expert Affichage Dynamique & Informatique depuis 1994",
    template: "%s | READI.FR"
  },
  description: "READI.FR c'est La Compétence ! Affichage dynamique, informatique, maintenance, pièces détachées et formation web. Pro depuis 1994, nous intervenons partout en France.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "READI.FR",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ["affichage dynamique", "informatique pro", "maintenance informatique", "pièces détachées", "hologramme 3d", "bornes tactiles", "formation web"],
  authors: [{ name: "READI" }],
  creator: "READI",
  publisher: "READI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://readi.fr",
    siteName: "READI.FR",
    title: "READI.FR - Service du Pro depuis 1994",
    description: "Expert en affichage dynamique et maintenance informatique. La Compétence depuis plus de 30 ans.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "READI.FR - Expertise Informatique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "READI.FR - Expertise Informatique",
    description: "La Compétence depuis 1994 pour vos services informatiques.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://readi.fr",
  }
};

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });
    return settings;
  } catch (e) {
    console.error("Error fetching site settings:", e);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const menuItems = await getMenuItems();
  const topBarItems = await getTopBarItems();
  
  // Log server-side pour debug
  console.log("RootLayout Settings:", JSON.stringify(settings, null, 2));

  // Construction des styles dynamiques
  const dynamicStyles = {
    "--primary-color": settings?.primaryColor || "#dc2626",
    "--font-family": settings?.fontFamily || "Inter",
    "--base-font-size": settings?.baseFontSize || "16px",
  } as React.CSSProperties;

  return (
    <html lang="fr" style={dynamicStyles}>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <JsonLd />
          <Header settings={settings} menuItems={menuItems} topBarItems={topBarItems} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <ChatBot />
          <BackToTop />
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
