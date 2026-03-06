"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function HeroActiveToggle({ defaultChecked, name }: { defaultChecked: boolean, name: string }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center gap-4">
            <input type="hidden" name={name} value={checked ? "on" : "off"} />
            <div className="flex items-center gap-2">
                <Switch 
                    checked={checked} 
                    onCheckedChange={setChecked} 
                    id="hero-active-toggle"
                    className="data-[state=checked]:bg-red-600"
                />
                <Label htmlFor="hero-active-toggle" className="cursor-pointer font-bold text-gray-700 select-none">
                    {checked ? (
                        <Badge className="bg-red-600 hover:bg-red-700 px-3 py-1">ÉLÉMENT ACTIF</Badge>
                    ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-300 px-3 py-1">ÉLÉMENT INACTIF</Badge>
                    )}
                </Label>
            </div>
        </div>
    );
}
