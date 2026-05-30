"use client";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitchButton";
import { Contact, Gamepad2, Home } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavLink {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const Navbar = () => {
    const [isHovered, setIsHovered] = useState<number | null>(null);
    const path = usePathname();

    const navLinks: NavLink[] = [
        { name: "Home", href: "/", icon: <Home size={18} /> },
        { name: "Playground", href: "/playground", icon: <Gamepad2 size={18} /> },
        { name: "Contact", href: "/contact", icon: <Contact size={18} /> },
    ];

    const activeIndex = navLinks.findIndex((link) => path === link.href);

    return (
        <>
            <nav className="flex fixed top-0 z-50 h-16 w-full items-center justify-between border-b border-border bg-background/80 px-10 backdrop-blur-sm">
                <div className="font-medium">
                    Dibya&#39;s Playground
                </div>

                <ul className="flex items-center justify-center gap-6">
                    <div className="flex items-center justify-center gap-5 rounded-lg bg-primary/10 px-2 py-2 text-sm font-medium text-primary">
                        {navLinks.map((link, index) => {
                            const isActivePath = activeIndex === index;
                            const isHoveredItem = isHovered === index;

                            return (
                                <Link
                                    key={index}
                                    href={link.href}
                                    title={link.name}
                                    onMouseEnter={() => setIsHovered(index)}
                                    onMouseLeave={() => setIsHovered(null)}
                                    className="relative flex items-center justify-center rounded-md p-2"
                                >
                                    {isActivePath && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 rounded-md bg-foreground"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}

                                    <AnimatePresence>
                                        {isHoveredItem && !isActivePath && (
                                            <motion.div
                                                layoutId="nav-hover"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute inset-0 rounded-md bg-foreground/10"
                                            />
                                        )}
                                    </AnimatePresence>

                                    <span
                                        className={`relative z-10 transition-colors duration-150 ${isActivePath
                                                ? "text-background"
                                                : "text-foreground"
                                            }`}
                                    >
                                        {link.icon}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                    <li>
                        <ThemeSwitcher />
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;