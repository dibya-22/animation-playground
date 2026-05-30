"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-md cursor-pointer"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ rotate: -15, opacity: 0.5 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 15, opacity: 0.5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ display: "block" }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}