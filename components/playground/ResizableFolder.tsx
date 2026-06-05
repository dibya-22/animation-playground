"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react"

type Direction = "shrink" | "right" | "bottom" | "expand" | null;
type Size = "1x1" | "1x3" | "3x1" | "3x3"

/*
?Sizes
shrink = 1x1
right = 1x3
bottom = 3x1
expand = 3x3
*/

const debugMode = false;
const ResizableFolder = () => {
    const startPos = useRef({ x: 0, y: 0 });
    const boxRef = useRef<HTMLDivElement>(null);

    const [direction, setDirection] = useState<Direction>(null);

    const [size, setSize] = useState<Size>("1x1");
    const [shadowSize, setShadowSize] = useState<Size>("1x1");

    const [preview, setPreview] = useState<boolean>(true)
    const [shadowVisibility, setShadowVisibility] = useState<boolean>(false)

    const onPointerDown = (e: React.PointerEvent) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
        if (preview) setShadowVisibility(true);
    }

    const [debugPos, setDebugPos] = useState({ relX: 0, relY: 0 })

    const onPointerMove = (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        if (!boxRef.current) return;

        const rect = boxRef.current.getBoundingClientRect();

        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        setDebugPos({ relX: Math.round(relX), relY: Math.round(relY) });

        const CELL = 80;

        const col = relX < CELL ? 1 : relX < CELL * 2 ? 2 : 3;
        const row = relY < CELL ? 1 : relY < CELL * 2 ? 2 : 3;

        const cellIndex = (row - 1) * 3 + col; // 1–9

        let newDirection: Direction;
        if (cellIndex === 1) newDirection = "shrink";
        else if (col >= 2 && row === 1) newDirection = "right";
        else if (col === 1 && row >= 2) newDirection = "bottom";
        else newDirection = "expand";

        setDirection(newDirection);
        setShadowSize(directionToGrid(newDirection));

        if (!preview) {
            setSize(directionToGrid(newDirection));
        }
    };

    const onPointerUp = () => {
        setDirection(null);

        if (preview) {
            setShadowVisibility(false);
            setSize(shadowSize);
        }
    };

    useEffect(() => {
        console.log(direction);
    }, [direction])


    function directionToGrid(direction: Direction) {
        switch (direction) {
            case "shrink": return "1x1"
            case "right": return "1x3"
            case "bottom": return "3x1"
            case "expand": return "3x3"
            default: return size
        }
    }

    function gridToValue(size: Size) {
        switch (size) {
            case "1x1": return { width: "80px", height: "80px" }
            case "1x3": return { width: "240px", height: "80px" }
            case "3x1": return { width: "80px", height: "240px" }
            case "3x3": return { width: "240px", height: "240px" }
        }
    }

    function gridToCSSGrid(size: Size) {
        switch (size) {
            case "1x1": return "grid-cols-3 grid-rows-3"
            case "1x3": return "grid-cols-3 grid-rows-1"
            case "3x1": return "grid-cols-1 grid-rows-3"
            case "3x3": return "grid-cols-3 grid-rows-3"
        }
    }



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

    const getApps = (size: Size) => {
        let appNums: number;;

        switch (size) {
            case "1x1": appNums = 9; break;
            case "1x3": appNums = 3; break;
            case "3x1": appNums = 3; break;
            case "3x3": appNums = 9; break;
        }

        const displayApps = [];
        for(let i=0; i<appNums; i++){
            displayApps.push(apps[i])
        }

        return displayApps
    }

    return (
        <div className="relative bg-secondary w-full h-100 flex items-start py-4 px-10">

            {debugMode && <div>
                <div className="absolute top-0 right-0 p-2 font-mono text-xs text-muted-foreground flex flex-col gap-0.5">
                    <span>relX: {debugPos.relX}</span>
                    <span>relY: {debugPos.relY}</span>
                    <span>size: {size}</span>
                    <span>shadowSize: {shadowSize}</span>
                </div>
                <div className="absolute top-0 left-0 w-60 h-60 my-4 mx-10 grid gap-0.5"
                    style={{ gridTemplateColumns: "80px 1fr", gridTemplateRows: "80px 1fr" }}>
                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground" >1x1</div>
                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground" >1x3</div>
                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground" >3x1</div>
                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground" >3x3</div>
                </div>
            </div>}

            <AnimatePresence>
                {preview && <motion.div
                    style={{
                        ...gridToValue(size),
                        visibility: shadowVisibility ? "visible" : "hidden"
                    }}
                    animate={direction ? gridToValue(directionToGrid(direction)) : gridToValue(shadowSize)}
                    className="absolute bg-foreground z-10 rounded-2xl opacity-20"
                />}
            </AnimatePresence>


            <motion.div
                ref={boxRef}
                animate={gridToValue(!preview && direction ? directionToGrid(direction) : size)}
                className={cn(
                    "relative w-20 h-20 rounded-2xl p-3",
                    "bg-primary-foreground border border-border",
                    "grid gap-2",
                    gridToCSSGrid(size)
                )}
            >
                {getApps(size).map((app, index) => (
                    <motion.div
                        key={index}
                        style={{ filter: appColor !== "color" ? "invert(var(--invert))" : "none" }}
                        className="flex items-center justify-center"
                    >
                        <Image
                            src={app.icon}
                            alt={app.name}
                            width={size === "1x1" ? 15 : 45}
                            height={size === "1x1" ? 15 : 45}
                        />
                    </motion.div>
                ))}

                <svg
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="absolute bottom-0 right-0 cursor-se-resize"
                >
                    <path
                        d="M16 2 Q14 14 2 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="text-primary"
                    />
                </svg>
            </motion.div>

            {/*! Setting */}
            <div className="absolute bottom-0 right-0 flex flex-col gap-1 p-2 items-start">
                <div className="flex items-center gap-1">
                    <label className="text-xs font-mono font-extralight text-muted-foreground">Size Preview: </label>
                    <motion.button
                        onClick={() => setPreview(p => !p)}
                        className="w-3 h-3 rounded-sm cursor-pointer flex items-center justify-center"
                        animate={{ backgroundColor: preview ? "var(--color-foreground)" : "transparent" }}
                        style={{ border: "1px solid var(--color-foreground)" }}
                        transition={{ duration: 0.15 }}
                    >
                        <motion.svg viewBox="0 0 10 10" className="w-2 h-2 overflow-visible">
                            <motion.path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                fill="none"
                                stroke="var(--color-background)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                animate={{
                                    pathLength: preview ? 1 : 0,
                                    opacity: preview ? 1 : 0,
                                }}
                                transition={{ duration: 0.15 }}
                            />
                        </motion.svg>
                    </motion.button>
                </div>
                <div className="flex items-center gap-1">
                    <label className="text-xs font-mono font-extralight text-muted-foreground">App Color: </label>
                    <motion.button
                        animate={{
                            boxShadow: appColor === "mono"
                                ? "0 0 0 2px #888"
                                : "0 0 0 0px transparent",
                        }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setAppColor("mono")}
                        className="w-3 h-3 rounded-sm bg-foreground cursor-pointer"
                    />
                    <motion.button
                        animate={{
                            boxShadow: appColor === "color"
                                ? "0 0 0 2px #888"
                                : "0 0 0 0px transparent",
                        }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setAppColor("color")}
                        className="w-3 h-3 rounded-sm bg-linear-to-br from-pink-500 via-yellow-400 to-cyan-400 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    )
}

export default ResizableFolder
