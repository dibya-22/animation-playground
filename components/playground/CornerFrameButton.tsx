"use client";
import { cn } from "@/lib/utils"
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerProps {
    className?: string;
    position?: CornerPosition;
    active?: boolean;
    hovered?: boolean;
}


const Corner = ({ className, position, active = false, hovered = false }: CornerProps) => {

    const getPositionValues = (pos: CornerPosition) => {
        if (active) {
            switch (pos) {
                case "top-left": return { top: 0, left: 0, bottom: "auto", right: "auto" };
                case "top-right": return { top: 0, right: 0, bottom: "auto", left: "auto" };
                case "bottom-left": return { bottom: 0, left: 0, top: "auto", right: "auto" };
                case "bottom-right": return { bottom: 0, right: 0, top: "auto", left: "auto" };
            }
        } else if (hovered && !active) {
            switch (pos) {
                case "top-left": return { top: -6, left: -6, bottom: "auto", right: "auto" };
                case "top-right": return { top: -6, right: -6, bottom: "auto", left: "auto" };
                case "bottom-left": return { bottom: -6, left: -6, top: "auto", right: "auto" };
                case "bottom-right": return { bottom: -6, right: -6, top: "auto", left: "auto" };
            }
        } else {
            switch (pos) {
                case "top-left": return { top: 0, left: 0, bottom: "auto", right: "auto" };
                case "top-right": return { top: 0, right: 0, bottom: "auto", left: "auto" };
                case "bottom-left": return { bottom: 0, left: 0, top: "auto", right: "auto" };
                case "bottom-right": return { bottom: 0, right: 0, top: "auto", left: "auto" };
            }
        }
    }

    return (
        <motion.div
            animate={getPositionValues(position!)}
            transition={{ duration: active ? 0.1 : 0.2, ease: "linear" }}
            className={cn(
                "absolute h-2 w-2 border-foreground z-50",
                position === "top-left" && `border-t border-l`,
                position === "top-right" && `border-t border-r`,
                position === "bottom-left" && `border-b border-l`,
                position === "bottom-right" && `border-b border-r`,
                className
            )}
        />
    )
};

const CornerFrameButton = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false)
    const activeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseDown = () => {
        if (activeTimer.current) clearTimeout(activeTimer.current);
        setActive(true);
    };

    const handleMouseUp = () => {
        activeTimer.current = setTimeout(() => {
            setActive(false);
        }, 10);
    };

    const clipPaths = [
        "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        "polygon(0% 0%, 8% 0%, 0% 15%, 0% 0%, 0% 0%)",
        "polygon(0% 0%, 20% 0%, 0% 35%, 0% 0%, 0% 0%)",
        "polygon(0% 0%, 45% 0%, 0% 65%, 0% 0%, 0% 0%)",
        "polygon(0% 0%, 70% 0%, 0% 100%, 0% 100%, 0% 100%)",
        "polygon(0% 0%, 85% 0%, 50% 100%, 0% 100%, 0% 100%)",
        "polygon(0% 0%, 100% 0%, 100% 60%, 60% 100%, 0% 100%)",
        "polygon(0% 0%, 100% 0%, 100% 85%, 95% 100%, 0% 100%)",
        "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)",
    ]

    return (
        <motion.button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={cn(
                "relative overflow-visible text-foreground px-10 py-5 cursor-pointer m-5 ",
                (isDark ? "bg-[repeating-linear-gradient(-60deg,transparent_0px,transparent_8px,rgba(255,255,255,0.08)_8px,rgba(255,255,255,0.08)_10px)]" :
                    "bg-[repeating-linear-gradient(-60deg,transparent_0px,transparent_8px,rgba(0,0,0,0.08)_8px,rgba(0,0,0,0.08)_10px)]"),
            )}
        >
            <motion.span
                animate={{
                    color: hovered ? "var(--color-background)" : "var(--color-foreground)"
                }}
                transition={{ duration: 0.3 }}
                className="relative z-50"
            >MOTION+</motion.span>

            <Corner position="top-left" active={active} hovered={hovered} />
            <Corner position="top-right" active={active} hovered={hovered} />
            <Corner position="bottom-left" active={active} hovered={hovered} />
            <Corner position="bottom-right" active={active} hovered={hovered} />

            <motion.div
                initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                animate={{
                    clipPath: hovered ? clipPaths : clipPaths.reverse()
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-foreground z-40"
            />
        </motion.button>

    )
}

export default CornerFrameButton
