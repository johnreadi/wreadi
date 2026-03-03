"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
    name?: string;
    defaultValue?: string;
    value?: string;
    label?: string;
    className?: string; // Container class
    inputClassName?: string; // Text input class
    onChange?: (color: string) => void;
}

export function ColorPicker({ name, defaultValue = "#ffffff", value, label, className, inputClassName, onChange }: ColorPickerProps) {
    const [color, setColor] = useState(value || defaultValue);

    useEffect(() => {
        if (value !== undefined) {
            setColor(value);
        }
    }, [value]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        if (onChange) {
            onChange(newColor);
        }
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
