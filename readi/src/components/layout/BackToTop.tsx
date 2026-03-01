"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Gérer la visibilité du bouton au scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    className="fixed bottom-24 right-6 z-[90]"
                >
                    <Button
                        size="icon"
                        onClick={scrollToTop}
                        className="w-12 h-12 rounded-xl bg-white text-red-600 border-2 border-red-100 shadow-xl hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-300 group"
                    >
                        <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                        <span className="sr-only">Retour en haut</span>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
