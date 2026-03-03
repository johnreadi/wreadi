"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt for iOS users after a delay if not in standalone mode
    if (isIosDevice && !isStandalone) {
        // Only show once per session or use local storage to limit frequency
        const hasSeenPrompt = sessionStorage.getItem("iosPwaPromptSeen");
        if (!hasSeenPrompt) {
            setTimeout(() => setShowPrompt(true), 5000);
        }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    if (isIOS) {
        sessionStorage.setItem("iosPwaPromptSeen", "true");
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="bg-white rounded-xl shadow-2xl border-2 border-orange-100 p-4 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
            
            <button 
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                    <Download className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-black text-gray-900 leading-tight">Installer l'application</h3>
                    <p className="text-sm text-gray-600 font-medium leading-snug">
                        {isIOS 
                            ? "Pour installer : appuyez sur Partager puis 'Sur l'écran d'accueil'" 
                            : "Installez notre application pour un accès plus rapide et hors ligne."}
                    </p>
                </div>
            </div>

            {!isIOS && (
                <Button 
                    onClick={handleInstallClick}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:from-orange-700 hover:to-red-700 shadow-lg"
                >
                    Installer maintenant
                </Button>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
