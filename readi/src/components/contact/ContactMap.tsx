"use client";

import { useEffect, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactMapProps {
    address?: string;
}

export function ContactMap({ address }: ContactMapProps) {
    // Coordonnées par défaut (Rouen)
    const defaultLat = 49.4361756;
    const defaultLon = 1.0868691;

    const [coords, setCoords] = useState({ lat: defaultLat, lon: defaultLon });

    useEffect(() => {
        if (!address) return;

        // Fetch des coordonnées via l'API Nominatim d'OpenStreetMap
        const fetchCoords = async () => {
            try {
                const query = address.replace(/\n/g, ", ");
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data && data.length > 0) {
                    setCoords({
                        lat: parseFloat(data[0].lat),
                        lon: parseFloat(data[0].lon)
                    });
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        };

        fetchCoords();
    }, [address]);

    const { lat, lon } = coords;
    const zoom = 16;

    // Calcul d'un petit décalage pour le centrage visuel
    const bbox = `${lon - 0.005},${lat - 0.003},${lon + 0.005},${lat + 0.003}`;

    // URL de l'embed OpenStreetMap
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

    // URL externe pour voir sur OSM en plein écran
    const externalUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

    // Formatage de l'adresse pour l'affichage (mise sur une seule ligne)
    const displayAddress = address ? address.split('\n').join(', ') : "24 Av. Jacques Cartier, Rouen";

    return (
        <div className="relative w-full h-full group">
            {/* Container de la carte avec style premium */}
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-2 border-white shadow-2xl">
                <iframe
                    title="Localisation READI.FR"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={mapUrl}
                    className="grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                    style={{ border: 0 }}
                />

                {/* Overlay Dégradé pour l'intégration */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-red-900/10 to-transparent" />
            </div>

            {/* Badge Flottant "Interactive" */}
            <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live Map</span>
                </div>
            </div>

            {/* Bouton de redirection externe */}
            <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="rounded-xl font-bold gap-2 shadow-lg scale-90 hover:scale-100 transition-transform bg-white text-gray-900"
                >
                    <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Ouvrir dans OpenStreetMap
                    </a>
                </Button>
            </div>

            {/* Centered Indicator (Visual only, to help locate the marker) */}
            <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/40 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 max-w-[90%] mx-auto">
                    <div className="w-10 h-10 bg-red-600 rounded-2xl flex shrink-0 items-center justify-center text-white shadow-lg shadow-red-600/20">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div className="pr-2 truncate">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Votre interlocuteur pro</p>
                        <p className="text-sm font-black text-gray-900 truncate">{displayAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
