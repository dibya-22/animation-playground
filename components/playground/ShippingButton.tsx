"use client";
import { useState } from "react";
import { Package, Truck } from "lucide-react"
import { motion, useAnimate } from "motion/react"
import { type AnimationSequence } from "motion/react"
import { cn } from "@/lib/utils"


const s = (
    selector: string,
    keyframes: Record<string, unknown>,
    options?: Record<string, unknown>
): AnimationSequence[number] => [selector, keyframes, options] as AnimationSequence[number]

const ShippingButton = () => {
    const [scope, animate] = useAnimate();

    const sequence: AnimationSequence = [
        s(".package-icon", { translateX: -30 }, { duration: 0.4 }),
        s(".order-text", { translateX: -100, opacity: 0, scale: 0 }, { duration: 0.4, at: "-20" }),
        s(".truck-icon", { display: "block", opacity: 1, scale: 1.5 }, { duration: 0.5, ease: "easeInOut" }),
        s(".package-icon", { translateX: 20, scale: 0, opacity: 0 }, { duration: 0.4 }),
        s(".truck-icon", { translateX: 250, color: "var(--color-foreground)", scale: 2 }, { duration: 0.9 }),
        s(".truck-icon", { y: [0, -2, 0, -2, 0] }, { duration: 0.1, at: "-20" }),
        s(".shipped-text", { display: "flex", opacity: [0, 1], translateX: [-100, 0] }, { duration: 0.9, at: "+1.4" }),
    ]

    const resetSequence: AnimationSequence = [
        s(".shipped-text", { opacity: 0, translateX: 250, display: "none" }, { duration: 0.5 }),
        s(".shipped-text", { opacity: 0, translateX: 0, display: "none" }, { duration: 0.2 }),
        s(".order-text", { opacity: 1, translateX: 0, scale: 1 }, { duration: 0.3 }),
        s(".package-icon", { scale: 1, opacity: 1, translateX: 0 }, { duration: 0.3, at: "<" }),
        s(".truck-icon", { opacity: 0, translateX: 0, scale: 1, display: "none" }, { duration: 0, at: "<" }),
        s(".main", { translateX: 0 }, { duration: 0.3, at: "<" }),
    ]

    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = async () => {
        if (isAnimating || !scope.current) return;
        setIsAnimating(true);
        await animate(sequence)
        await new Promise((res) => setTimeout(res, 1000))
        if (!scope.current) return;
        await animate(resetSequence)
        setIsAnimating(false);
    }

    return (
        <motion.button
            type="button"
            ref={scope}
            onClick={startAnimation}
            onPointerUp={startAnimation}
            onTouchEnd={(event) => {
                event.preventDefault();
                startAnimation();
            }}
            style={{ boxShadow: "var(--button-shadow)" }}
            className={cn(
                "relative w-70 h-25 flex items-center justify-center gap-2 scale-70",
                "bg-card hover:bg-accent text-foreground border border-border",
                "px-4 py-2 rounded-full cursor-pointer overflow-hidden",
            )}
        >
            <motion.div
                className="main flex items-center gap-4"
            >
                <motion.div
                    style={{
                        scale: 1,
                    }}
                    className="package-icon"
                >
                    <Package size={30} />
                </motion.div>

                <motion.div
                    style={{
                        display: "none",
                        opacity: 0,
                        scale: 1,
                        x: -20,
                    }}
                    className="truck-icon z-20 text-foreground"
                >
                    <Truck size={30} />
                </motion.div>

                <motion.span
                    style={{
                        opacity: 1,
                        display: "none",
                    }}
                    className="shipped-text absolute inset-0 flex items-center justify-center text-xl font-semibold"
                >
                    Shipped
                </motion.span>

                <motion.span
                    style={{
                        opacity: 1,
                    }}
                    className="order-text text-xl font-semibold"
                >
                    Ship Order
                </motion.span>
            </motion.div>
        </motion.button>
    )
}

export default ShippingButton
