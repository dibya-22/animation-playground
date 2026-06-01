"use client"
import { useState } from "react"
import { AnimatePresence, easeInOut, motion } from "motion/react"

const navItems = [
    { icon: "⊞", label: "Overview" },
    { icon: "↗", label: "Analytics" },
    { icon: "◎", label: "Users" },
    { icon: "☰", label: "Reports" },
    { icon: "⚙", label: "Settings" },
]

const sidebarVariants = {
    open: { width: "220px" },
    closed: { width: "60px" },
}

const labelVariants = {
    open: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.2,
        },
    }),
    closed: (i: number) => ({
        opacity: 0,
        x: -8,
        transition: {
            delay: (navItems.length - 1 - i) * 0.03,
        },
    }),
};

export default function SidebarLayout() {
    const [open, setOpen] = useState(true)
    const [active, setActive] = useState("Overview")

    return (
        <div className="flex w-full h-120 bg-secondary text-secondary-foreground font-mono overflow-hidden">

            <motion.aside
                variants={sidebarVariants}
                animate={open ? "open" : "closed"}
                initial="open"
                transition={{ duration: 0.3, ease: easeInOut }}
                className="relative flex flex-col h-full border-r border-border overflow-hidden shrink-0"
            >
                <div className="flex items-center gap-3 h-14 px-4 border-b border-border">
                    <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">D</span>
                    </div>

                    <motion.span
                        variants={labelVariants}
                        animate={open ? "open" : "closed"}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium text-muted-foreground whitespace-nowrap overflow-hidden"
                    >
                        Workspace
                    </motion.span>
                </div>

                <motion.nav
                    className="flex-1 px-2 py-3 flex flex-col gap-0.5"
                >
                    {navItems.map(({ icon, label }) => (
                        <motion.button
                            key={label}
                            onClick={() => setActive(label)}
                            className={`relative flex items-center gap-3 px-2.5 py-2 rounded-md w-full text-left transition-colors duration-150 group `}
                        >
                            <AnimatePresence>
                                {active === label && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-foreground/30 absolute inset-0 rounded-full" />
                                )}
                            </AnimatePresence>
                            <span className="text-base w-5 text-center shrink-0">
                                {icon}
                            </span>

                            <motion.span
                                custom={navItems.findIndex((item) => item.label === label)}
                                variants={labelVariants}
                                animate={open ? "open" : "closed"}
                            >
                                {label}
                            </motion.span>
                        </motion.button>
                    ))}
                </motion.nav>

                <div className="flex items-center gap-3 px-3 py-4 border-t border-border">
                    <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center shrink-0 text-[10px] text-muted-foreground">
                        DB
                    </div>

                    <motion.div
                        variants={labelVariants}
                        animate={open ? "open" : "closed"}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-foreground whitespace-nowrap">
                            Dibya
                        </p>

                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                            Developer
                        </p>
                    </motion.div>
                </div>
            </motion.aside>

            <div className="relative">
                <motion.button
                    onClick={() => setOpen(!open)}
                    animate={{ x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    className="absolute top-6.5 -translate-y-1/2 -left-3 z-50 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
                    aria-label={open ? "Close sidebar" : "Open sidebar"}
                >
                    <motion.svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        animate={{ rotate: open ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <path
                            d="M6 2L3.5 5L6 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </motion.button>
            </div>

            <main className="flex-1 hidden md:flex flex-col overflow-hidden ">

                <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border shrink-0">
                    <span className="text-sm text-muted-foreground tracking-widest uppercase text-[11px]">
                        {active}
                    </span>

                    <div className="flex items-center gap-2">
                        <button className="text-[11px] text-muted-foreground hover:text-foreground border border-border hover:bg-accent px-3 py-1.5 rounded transition-colors">
                            Export
                        </button>

                        <button className="text-[11px] bg-primary text-primary-foreground hover:opacity-90 px-3 py-1.5 rounded transition-all">
                            + New
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Total users", value: "12,840", delta: "+8.2%", up: true },
                            { label: "Revenue", value: "$4,290", delta: "+3.1%", up: true },
                            { label: "Sessions", value: "342", delta: "-1.4%", up: false },
                        ].map(({ label, value, delta, up }) => (
                            <div
                                key={label}
                                className="bg-card border border-border rounded-lg p-4"
                            >
                                <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
                                    {label}
                                </p>

                                <p className="text-xl font-medium text-card-foreground">
                                    {value}
                                </p>

                                <p
                                    className={`text-[11px] mt-1 ${up ? "text-emerald-500" : "text-red-500"
                                        }`}
                                >
                                    {delta}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-[1fr_280px] gap-3 flex-1">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">
                                Weekly traffic
                            </p>

                            <div className="flex items-end gap-2 h-24">
                                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-accent rounded-sm"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">
                                Activity
                            </p>

                            <div className="flex flex-col gap-3">
                                {[
                                    { msg: "New signup", time: "2m" },
                                    { msg: "Report exported", time: "15m" },
                                    { msg: "User updated", time: "1h" },
                                    { msg: "Deploy success", time: "3h" },
                                ].map(({ msg, time }) => (
                                    <div key={msg} className="flex items-center gap-2.5">
                                        <div className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />

                                        <span className="text-[12px] text-muted-foreground flex-1">
                                            {msg}
                                        </span>

                                        <span className="text-[10px] text-muted-foreground/70">
                                            {time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}