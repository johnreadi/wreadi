"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ChevronRight, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DynamicSectionProps {
    section: {
        id: string;
        title: string | null;
        subtitle: string | null;
        content: string | null;
        mediaType: string;
        mediaUrl: string | null;
        slides?: string | null;
        layout: string;
        animation: string | null;
        ctaText: string | null;
        ctaLink: string | null;
        backgroundColor?: string | null;
        // Font settings
        titleFontSize?: string | null;
        titleFontFamily?: string | null;
        contentFontSize?: string | null;
    };
}

export function DynamicSection({ section }: DynamicSectionProps) {
    const isReverse = section.layout === "RIGHT";
    const isCenter = section.layout === "CENTER";
    const isFull = section.layout === "FULL";
    
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = section.slides ? JSON.parse(section.slides) : [];

    useEffect(() => {
        if (section.mediaType === "SLIDESHOW" && slides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [section.mediaType, slides.length]);

    const getAnimation = () => {
        switch (section.animation) {
            case "slide":
                return { initial: { opacity: 0, x: isReverse ? 50 : -50 }, whileInView: { opacity: 1, x: 0 } };
            case "scale":
                return { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } };
            case "fade":
            default:
                return { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } };
        }
    };

    const anim = getAnimation();
    
    // Check if media is a video file (local upload) or embed (YouTube/Vimeo)
    const isVideoFile = (url: string) => {
        return url.startsWith('/') || url.match(/\.(mp4|webm|ogg)$/i) || url.includes('/uploads/');
    };

    return (
        <section 
            className={`py-12 lg:py-20 overflow-hidden ${isFull && !section.backgroundColor ? 'bg-gray-900 border-y-4 border-red-600/20' : ''}`}
            style={{ backgroundColor: section.backgroundColor || undefined }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : isCenter ? 'items-center text-center' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>

                    {/* Content side */}
                    <motion.div
                        {...anim}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`flex-1 space-y-6 ${isFull ? 'text-white' : ''} ${isCenter ? 'max-w-3xl' : ''}`}
                    >
                        {section.subtitle && (
                            <span className={`text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase ${isFull ? 'text-red-400' : 'text-red-600'}`}>
                                {section.subtitle}
                            </span>
                        )}
                        <h2
                            className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase ${isFull ? 'text-white' : 'text-gray-900'}`}
                            style={{
                                fontSize: section.titleFontSize || undefined,
                                fontFamily: section.titleFontFamily || undefined
                            }}
                        >
                            {section.title}
                        </h2>
                        <div
                            className={`text-base sm:text-lg leading-relaxed ${isFull ? 'text-gray-300' : 'text-gray-600'}`}
                            style={{ fontSize: section.contentFontSize || undefined }}
                            dangerouslySetInnerHTML={{ __html: section.content || "" }}
                        />

                        {(section.ctaText && section.ctaLink) && (
                            <div className={`pt-4 ${isCenter ? 'flex justify-center' : ''}`}>
                                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 h-auto min-h-[3rem] py-3 px-6 text-base font-bold shadow-xl shadow-red-600/20 group whitespace-normal text-center leading-tight">
                                    <Link href={section.ctaLink} className="flex items-center gap-2">
                                        <span>{section.ctaText}</span>
                                        <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    {/* Media side */}
                    {!isFull && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`flex-1 w-full max-w-xl relative ${isCenter ? 'mt-12 order-last' : ''}`}
                        >
                            <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-red-600/10 group">
                                {section.mediaType === "IMAGE" && section.mediaUrl && (
                                    <>
                                        <img
                                            src={section.mediaUrl}
                                            alt={section.title || ""}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}

                                {section.mediaType === "VIDEO" && section.mediaUrl && (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        {isVideoFile(section.mediaUrl) ? (
                                            <video 
                                                src={section.mediaUrl}
                                                className="w-full h-full object-cover"
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <iframe
                                                src={section.mediaUrl.replace('watch?v=', 'embed/')}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        )}
                                    </div>
                                )}

                                {section.mediaType === "SLIDESHOW" && (
                                    <div className="w-full h-full relative group bg-gray-100 overflow-hidden">
                                        {slides.length > 0 ? (
                                            <>
                                                {slides.map((slide: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`absolute inset-0 transition-opacity duration-1000 ${
                                                            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                                        }`}
                                                    >
                                                        <img
                                                            src={slide.url}
                                                            alt={slide.alt || `Slide ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {/* Navigation Dots */}
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                                    {slides.map((_: any, index: number) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentSlide(index)}
                                                            className={`w-2 h-2 rounded-full transition-all ${
                                                                index === currentSlide ? "bg-white w-4" : "bg-white/50"
                                                            }`}
                                                            aria-label={`Go to slide ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <Layout className="h-12 w-12 mb-2" />
                                                <p className="text-sm italic">Aucune image dans le diaporama.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -z-10 -top-6 -left-6 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-50" />
                            <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50" />
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
