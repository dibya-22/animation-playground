"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, X } from "lucide-react";

type Direction = "shrink" | "right" | "bottom" | "expand" | null;
type Size = "1x1" | "1x3" | "3x1" | "3x3";
const hideInMobile = "hidden md:flex"
const hideInDesktop = "flex md:hidden"

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
        <Image src={app.icon} alt={app.name} width={size} height={size} draggable={false} />
    </motion.div>
)

const CompactGrid = ({ slice, filterStyle, onClick }: { slice: AppProp[]; filterStyle: string; onClick: () => void; }) => (
    <div
        key="compact"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="grid grid-cols-2 grid-rows-2 gap-1"
    >
        {slice.map((app, index) => (
            <AppIcon key={index} app={app} size={22} index={index} filterStyle={filterStyle} />
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

function getSaved() {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("resizable-folder");
    return saved ? JSON.parse(saved) : null;
}

const debugMode = false;

const ResizableFolder = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const didDragRef = useRef(false);
    const didOpenMobileMenuRef = useRef(false);

    const [direction, setDirection] = useState<Direction>(null);
    const [size, setSize] = useState<Size>("1x1");
    const [shadowSize, setShadowSize] = useState<Size>("1x1");
    const [preview, setPreview] = useState<boolean>(true);
    const [shadowVisibility, setShadowVisibility] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fullAppView, setFullAppView] = useState(false);
    const [appColor, setAppColor] = useState<"mono" | "color">("mono");
    const [appCounts, setAppCounts] = useState<number>(8);
    const [debugPos, setDebugPos] = useState({ relX: 0, relY: 0 })

    useEffect(() => {
        const saved = getSaved();
        if (!saved) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved.size) { setSize(saved.size); setShadowSize(saved.size); }
        if (saved.preview !== undefined) setPreview(saved.preview);
        if (saved.appColor) setAppColor(saved.appColor);
        if (saved.appCounts) setAppCounts(saved.appCounts);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("resizable-folder", JSON.stringify({
            size, appCounts, appColor, preview
        }));
    }, [size, appCounts, appColor, preview]);

    const onPointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        didDragRef.current = false;
        if (preview) setShadowVisibility(true);
    }

    const onPointerMove = (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        didDragRef.current = true;
        if (!boxRef.current) return;

        const rect = boxRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        if (debugMode) setDebugPos({ relX: Math.round(relX), relY: Math.round(relY) });

        const CELL = 80;
        const col = relX < CELL ? 1 : relX < CELL * 2 ? 2 : 3;
        const row = relY < CELL ? 1 : relY < CELL * 2 ? 2 : 3;
        const cellIndex = (row - 1) * 3 + col;

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

    function directionToGrid(direction: Direction): Size {
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

    const totalApps: AppProp[] = [
        { name: "YouTube", icon: `/app-image/youtube_${appColor}.png` },
        { name: "Google", icon: `/app-image/google_${appColor}.png` },
        { name: "Twitter", icon: `/app-image/twitter_${appColor}.png` },
        { name: "Facebook", icon: `/app-image/facebook_${appColor}.png` },
        { name: "Whatsapp", icon: `/app-image/whatsapp_${appColor}.png` },
        { name: "Reddit", icon: `/app-image/reddit_${appColor}.png` },
        { name: "Pinterest", icon: `/app-image/pinterest_${appColor}.png` },
        { name: "PlayStore", icon: `/app-image/playstore_${appColor}.png` },
        { name: "Spotify", icon: `/app-image/spotify_${appColor}.png` },
    ];

    const apps = Array.from({ length: appCounts }, (_, i) => totalApps[i % totalApps.length]);
    const filterStyle = appColor !== "color" ? "invert(var(--invert))" : "none";

    const currentSize = !preview && direction ? directionToGrid(direction) : size;

    const getApps = (size: Size) => {
        if (size === "1x1") {
            return apps.slice(0, 9).map((app, i) => (
                <AppIcon key={i} app={app} size={15} index={i} filterStyle={filterStyle} />
            ));
        }

        if (size === "3x3") {
            if (appCounts <= 9) {
                return apps.slice(0, 9).map((app, i) => (
                    <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle} />
                ));
            }
            return [
                ...apps.slice(0, 8).map((app, i) => (
                    <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle} />
                )),
                <CompactGrid key="compact" onClick={() => setFullAppView(true)} slice={apps.slice(8, 12)} filterStyle={filterStyle} />,
            ];
        }

        // 3x1 / 1x3
        if (appCounts <= 3) {
            return apps.slice(0, 3).map((app, i) => (
                <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle} />
            ));
        }
        return [
            ...apps.slice(0, 2).map((app, i) => (
                <AppIcon key={i} app={app} size={45} index={i} filterStyle={filterStyle} />
            )),
            <CompactGrid key="compact" onClick={() => setFullAppView(true)} slice={apps.slice(2, 6)} filterStyle={filterStyle} />,
        ];
    }

    return (
        <div className="relative bg-secondary w-full min-h-150 flex items-start py-4 px-10">

            {/* Folder */}
            <AnimatePresence>
                {!fullAppView && (
                    <motion.div key="folder-root" className="contents">

                        {debugMode && (
                            <div>
                                <div className="absolute top-0 right-0 p-2 font-mono text-xs text-muted-foreground flex flex-col gap-0.5">
                                    <span>relX: {debugPos.relX}</span>
                                    <span>relY: {debugPos.relY}</span>
                                    <span>size: {size}</span>
                                    <span>shadowSize: {shadowSize}</span>
                                </div>
                                <div className="absolute top-0 left-0 w-60 h-60 my-4 mx-10 grid gap-0.5"
                                    style={{ gridTemplateColumns: "80px 1fr", gridTemplateRows: "80px 1fr" }}>
                                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground">1x1</div>
                                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground">1x3</div>
                                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground">3x1</div>
                                    <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-mono text-muted-foreground">3x3</div>
                                </div>
                            </div>
                        )}

                        {/* Shadow */}
                        <AnimatePresence>
                            {preview && (
                                <motion.div
                                    initial={gridToValue(size)}
                                    style={{ visibility: shadowVisibility ? "visible" : "hidden" }}
                                    animate={direction ? gridToValue(directionToGrid(direction)) : gridToValue(shadowSize)}
                                    className={cn("absolute bg-foreground z-10 rounded-2xl opacity-20", hideInMobile)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Folder Box */}
                        <motion.div
                            ref={boxRef}
                            initial={{ opacity: 0, ...gridToValue("1x1") }}
                            animate={{ opacity: 1, ...gridToValue(currentSize) }}
                            exit={{ opacity: 0, ...gridToValue("1x1") }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            onPointerDown={() => { didDragRef.current = false; }}
                            onClick={() => {
                                if (didOpenMobileMenuRef.current) {
                                    didOpenMobileMenuRef.current = false;
                                    return;
                                }
                                if (size === "1x1" && !didDragRef.current) setFullAppView(true);
                            }}
                            className={cn(
                                "relative rounded-2xl p-3",
                                "bg-primary-foreground border border-border",
                                "grid gap-2 select-none",
                                gridToCSSGrid(currentSize)
                            )}
                        >
                            {getApps(currentSize)}

                            <ResizeHandle
                                className={hideInMobile}
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                            />
                            <ResizeHandle
                                className={hideInDesktop}
                                onClick={() => {
                                    setMobileMenuOpen(true);
                                    didOpenMobileMenuRef.current = true;
                                }}
                            />
                        </motion.div>

                        {/* Mobile Resize Menu */}
                        <AnimatePresence>
                            {mobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={cn("fixed inset-0 z-20 flex items-center justify-center bg-black/40", hideInDesktop)}
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
                                                    onClick={() => { setSize(s); setMobileMenuOpen(false); }}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors",
                                                        size === s ? "border-foreground bg-background" : "border-border bg-muted"
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

                    </motion.div>
                )}
            </AnimatePresence>

            {/* All Apps */}
            <AnimatePresence>
                {fullAppView && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"
                            onClick={() => setFullAppView(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={cn(
                                "absolute top-2 left-2 w-[90%] max-h-[80vh] z-20",
                                "grid grid-cols-4 auto-rows-max gap-6",
                                "rounded-3xl p-8",
                                "bg-background/95 backdrop-blur-xl",
                                "border border-border/50 shadow-2xl",
                                "overflow-y-auto select-none"
                            )}
                        >
                            {apps.map((app, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="flex flex-col items-center gap-2 cursor-pointer"
                                >
                                    <AppIcon app={app} size={48} index={index} filterStyle={filterStyle} />
                                    <span className="text-[11px] text-center text-muted-foreground">{app.name}</span>
                                </motion.div>
                            ))}
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: apps.length * 0.02 }}
                                className="flex flex-col items-center gap-2 cursor-pointer"
                                onClick={() => setFullAppView(false)}
                            >
                                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <X size={20} className="text-muted-foreground" />
                                </div>
                                <span className="text-[11px] text-center text-muted-foreground">Close</span>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Settings — Bottom Left */}
            <div className="absolute bottom-0 left-0 flex flex-col gap-1 p-2 items-start z-20">
                <div className={cn("text-xs font-mono font-extralight", hideInDesktop)}>Click on bold border to resize</div>
                <div className={cn("text-xs font-mono font-extralight text-muted-foreground", hideInDesktop)}>Draggable feature on Desktop</div>
                <div className="flex items-center gap-2 text-xs font-mono font-extralight text-muted-foreground">
                    <label>App Numbers:</label>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setAppCounts(c => Math.max(1, c - 1))}
                            disabled={appCounts <= 1}
                            className="flex items-center justify-center w-5 h-5 rounded-full border border-muted-foreground/30 hover:bg-muted-foreground/10 disabled:bg-muted-foreground/50 active:scale-95 disabled:active:scale-100 cursor-pointer"
                        >
                            <Minus size={10} />
                        </button>
                        <span className="w-5 text-center">{appCounts}</span>
                        <button
                            onClick={() => setAppCounts(c => Math.min(15, c + 1))}
                            disabled={appCounts >= 15}
                            className="flex items-center justify-center w-5 h-5 rounded-full border border-muted-foreground/30 hover:bg-muted-foreground/10 disabled:bg-muted-foreground/50 active:scale-95 disabled:active:scale-100 cursor-pointer"
                        >
                            <Plus size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings — Bottom Right */}
            <div className="absolute bottom-0 right-0 flex flex-col gap-1 p-2 items-start z-20">
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
                                animate={{ pathLength: preview ? 1 : 0, opacity: preview ? 1 : 0 }}
                                transition={{ duration: 0.15 }}
                            />
                        </motion.svg>
                    </motion.button>
                </div>
                <div className="flex items-center gap-1">
                    <label className="text-xs font-mono font-extralight text-muted-foreground">App Color: </label>
                    <motion.button
                        animate={{ boxShadow: appColor === "mono" ? "0 0 0 2px #888" : "0 0 0 0px transparent" }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setAppColor("mono")}
                        className="w-3 h-3 rounded-sm bg-foreground cursor-pointer"
                    />
                    <motion.button
                        animate={{ boxShadow: appColor === "color" ? "0 0 0 2px #888" : "0 0 0 0px transparent" }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setAppColor("color")}
                        className="w-3 h-3 rounded-sm bg-linear-to-br from-pink-500 via-yellow-400 to-cyan-400 cursor-pointer"
                    />
                </div>
            </div>

        </div>
    );
}

export default ResizableFolder;