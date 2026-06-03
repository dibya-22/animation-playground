"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

const sizeMap: Record<string, string> = {
    "1-1": "w-[80px] h-[80px]",
    "1-3": "w-[256px] h-[80px]",
    "3-1": "w-[80px] h-[256px]",
    "3-3": "w-[256px] h-[256px]",
}



const ResizableFolder = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark";

    const SIZES = ["1x1", "1x3", "3x1", "3x3"] as const

    const [cols, setCols] = useState(1)
    const [rows, setRows] = useState(1)

    const [appColor, setAppColor] = useState<"mono" | "color">("mono");

    const apps = [
        {
            name: "Google",
            icon: `/app-image/google_${appColor}.png`,
        },
        {
            name: "YouTube",
            icon: `/app-image/youtube_${appColor}.png`,
        },
        {
            name: "Facebook",
            icon: `/app-image/facebook_${appColor}.png`,
        },
        {
            name: "WhatsApp",
            icon: `/app-image/whatsapp_${appColor}.png`,
        },
        {
            name: "Google",
            icon: `/app-image/google_${appColor}.png`,
        },
        {
            name: "YouTube",
            icon: `/app-image/youtube_${appColor}.png`,
        },
        {
            name: "Facebook",
            icon: `/app-image/facebook_${appColor}.png`,
        },
        {
            name: "WhatsApp",
            icon: `/app-image/whatsapp_${appColor}.png`,
        },
        {
            name: "Google",
            icon: `/app-image/google_${appColor}.png`,
        },
    ]

    return (
        <div className="relative bg-secondary w-full h-50 flex items-start py-4 px-10">
            <div
                className={cn(
                    "relative w-20 h-20 rounded-2xl p-3",
                    "bg-primary-foreground border border-border",
                    "grid grid-cols-3 grid-rows-3 gap-2"
                )}
            >
                {apps.map((app, index) => (
                    <div key={index}>
                        <Image
                            src={app.icon}
                            alt={app.name}
                            width={15}
                            height={15}
                            className={cn(
                                appColor !== "color" ? "dark:invert" : "",
                            )}
                        />
                    </div>
                ))}

                <div
                    style={{
                        clipPath: "polygon(74% 0%, 84% 6%, 91% 18%, 95% 34%, 94% 50%, 88% 66%, 78% 80%, 65% 91%, 49% 99%, 35% 95%, 25% 86%, 18% 74%, 16% 60%, 20% 48%, 28% 39%, 38% 33%, 50% 27%, 59% 18%, 65% 8%)",
                    }}
                    className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                />
            </div>

            <div className="absolute bottom-0 right-0 flex gap-1 p-1">
                <button
                    onClick={() => setAppColor("mono")}
                    className="w-3 h-3 rounded-sm bg-foreground cursor-pointer"
                />
                <button
                    onClick={() => setAppColor("color")}
                    className="w-3 h-3 rounded-sm bg-linear-to-br from-pink-500 via-yellow-400 to-cyan-400 cursor-pointer"
                />
            </div>
        </div>
    )
}

export default ResizableFolder
