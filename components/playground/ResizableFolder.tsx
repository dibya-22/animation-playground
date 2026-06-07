"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus } from "lucide-react";

type Direction = "shrink" | "right" | "bottom" | "expand" | null;
type Size = "1x1" | "1x3" | "3x1" | "3x3";
const hideInMobile = "hidden md:flex"
const hideInDesktop = "flex md:hidden"

/*
?Sizes
shrink = 1x1
right = 1x3
bottom = 3x1
expand = 3x3
*/
type AppProp = {
    name: string;
    icon: string;
}
const AppIcon = ({ app, size, index, filterStyle }: { app: AppProp; size: number; index: number; filterStyle: string }) => (
    <motion.div
        key={index}
        style={{ filter: filterStyle }}
        className="flex items-center justify-center pointer-events-none"
    >
        <Image src={app.icon} alt={app.name} width={size} height={size} draggable={false}/>
    </motion.div>
)

const CompactGrid = ({ slice, filterStyle }: { slice: AppProp[]; filterStyle: string }) => (
    <div key="compact" className="grid grid-cols-2 grid-rows-2 gap-1">
        {slice.map((app, index) => (
            <AppIcon key={index} app={app} size={22} index={index} filterStyle={filterStyle}/>
        ))}
    </div>
)

const ResizeHandle = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="16" height="16" viewBox="0 0 16 16" fill="none"
        className={cn("absolute bottom-0 right-0 cursor-se-resize", className)}
        {...props}
    >
        <path d="M16 2 Q14 14 2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
    </svg>
)

const debugMode = false;
const ResizableFolder = () => {
    const boxRef = useRef<HTMLDivElement>(null);

    const [direction, setDirection] = useState<Direction>(null);

    const [size, setSize] = useState<Size>("1x1");
    const [shadowSize, setShadowSize] = useState<Size>("1x1");

    const [preview, setPreview] = useState<boolean>(true)
    const [shadowVisibility, setShadowVisibility] = useState<boolean>(false)

    const onPointerDown = (e: React.PointerEvent) => {
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

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


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
    const totalApps = [
        {
            name: "YouTube",
            icon: `/app-image/youtube_${appColor}.png`,
        },

        {
            name: "Google",
            icon: `/app-image/google_${appColor}.png`,
        },
        {
            name: "Twitter",
            icon: `/app-image/twitter_${appColor}.png`,
        },
        {
            name: "Facebook",
            icon: `/app-image/facebook_${appColor}.png`,
        },
        {
            name: "Whatsapp",
            icon: `/app-image/whatsapp_${appColor}.png`,
        },
        {
            name: "Reddit",
            icon: `/app-image/reddit_${appColor}.png`,
        },
        {
            name: "Pinterest",
            icon: `/app-image/pinterest_${appColor}.png`,
        },
        {
            name: "PlayStore",
            icon: `/app-image/playstore_${appColor}.png`,
        },
        {
            name: "Spotify",
            icon: `/app-image/spotify_${appColor}.png`,
        },
    ]


    const [appCounts, setAppCounts] = useState(8)
    const apps = Array.from({ length: appCounts }, (_, i) => totalApps[i % totalApps.length]);

    const filterStyle = appColor !== "color" ? "invert(var(--invert))" : "none"


    const getApps = (size: Size) => {
        if (size === "1x1") {
            return apps.slice(0, 9).map((app, i) => <AppIcon key={i} app={app} size={15} index={i} filterStyle={filterStyle}/>)
        }

        if (size === "3x3") {
            if (appCounts <= 9) {
                return apps.slice(0, 9).map((app, i) => <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle}/>)
            }
            return [
                ...apps.slice(0, 8).map((app, i) => <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle}/>),
                <CompactGrid key="compact" slice={apps.slice(8, 12)} filterStyle={filterStyle}/>,
            ]
        }

        //* 3x1 / 1x3
        if (appCounts <= 3) {
            return apps.slice(0, 3).map((app, i) => <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle}/>)
        }
        return [
            ...apps.slice(0, 2).map((app, i) => <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle}/>),
            <CompactGrid key="compact" slice={apps.slice(2, 6)} filterStyle={filterStyle}/>,
        ]
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
                    className={cn(
                        "absolute bg-foreground z-10 rounded-2xl opacity-20",
                        hideInMobile
                    )}
                />}
            </AnimatePresence>


            <motion.div
                ref={boxRef}
                animate={gridToValue(!preview && direction ? directionToGrid(direction) : size)}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                className={cn(
                    "relative w-20 h-20 rounded-2xl p-3",
                    "bg-primary-foreground border border-border",
                    "grid gap-2 select-none",
                    gridToCSSGrid(size)
                )}
            >
                {getApps(size)}

                {/* Desktop Resize Draggable Border */}
                <ResizeHandle className={hideInMobile} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />


                {/* Mobile Resize Clickable Border */}
                <ResizeHandle className={hideInDesktop} onClick={() => setMobileMenuOpen(true)} />

            </motion.div>

            {/* Mobile Resizing Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn("fixed inset-0  z-20 flex items-center justify-center bg-black/40", hideInDesktop)}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border rounded-2xl p-3"
                            onClick={e => e.stopPropagation()}
                        >
                            <p className="text-[10px] font-mono text-foreground mb-2">resize</p>
                            <div className="grid grid-cols-2 gap-2">
                                {(["1x1", "1x3", "3x1", "3x3"] as Size[]).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setSize(s); setMobileMenuOpen(false) }}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors",
                                            size === s
                                                ? "border-foreground bg-background"
                                                : "border-border bg-muted"
                                        )}
                                    >
                                        <div
                                            className="grid gap-0.5"
                                            style={{
                                                gridTemplateColumns: `repeat(${s[2]}, 10px)`,
                                                gridTemplateRows: `repeat(${s[0]}, 10px)`,
                                            }}
                                        >
                                            {Array.from({ length: Number(s[0]) * Number(s[2]) }).map((_, i) => (
                                                <div key={i} className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/40" />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-mono text-foreground">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/*! Setting */}
            <div className="absolute bottom-0 left-0 flex flex-col gap-1 p-2 items-start">
                <div className={cn("text-xs font-mono font-extralight", hideInDesktop)}>Click on bold border to resize</div>
                <div className={cn("text-xs font-mono font-extralight text-muted-foreground", hideInDesktop)}>Draggable feature on Desktop</div>

                <div className="flex items-center gap-2 text-xs font-mono font-extralight text-muted-foreground">
                    <label>App Numbers:</label>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setAppCounts(appCounts - 1)}
                            disabled={appCounts <= 1}
                            className="flex items-center justify-center w-5 h-5 rounded-full border border-muted-foreground/30 hover:bg-muted-foreground/10 disabled:bg-muted-foreground/50 active:scale-95 disabled:active:scale-100 cursor-pointer"
                        >
                            <Minus size={10} />
                        </button>
                        <span className="w-5 text-center">{appCounts}</span>
                        <button
                            onClick={() => setAppCounts(appCounts + 1)}
                            disabled={appCounts >= 15}
                            className="flex items-center justify-center w-5 h-5 rounded-full border border-muted-foreground/30 hover:bg-muted-foreground/10 disabled:bg-muted-foreground/50 active:scale-95 disabled:active:scale-100 cursor-pointer"
                        >
                            <Plus size={10} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 flex flex-col gap-1 p-2 items-start">
                <div className={cn("items-center gap-1", hideInMobile)}>
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
