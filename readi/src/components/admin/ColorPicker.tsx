"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
    name: string;
    defaultValue?: string;
    label?: string;
    className?: string; // Container class
    inputClassName?: string; // Text input class
}

export function ColorPicker({ name, defaultValue = "#ffffff", label, className, inputClassName }: ColorPickerProps) {
    const [color, setColor] = useState(defaultValue);

    useEffect(() => {
        setColor(defaultValue);
    }, [defaultValue]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    return (
        <div className={`flex gap-4 items-center ${className || ""}`}>
            <Input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="h-10 w-20 p-1 cursor-pointer"
            />
            <Input
                name={name}
                value={color}
                onChange={handleColorChange}
                placeholder="#ffffff"
                className={`flex-1 h-10 text-xs ${inputClassName || ""}`}
            />
        </div>
    );
}
