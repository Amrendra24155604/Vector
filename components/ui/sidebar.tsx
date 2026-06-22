"use client";

import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type SidebarLinkType = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type SidebarContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

export function SidebarProvider({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) {
    const [openState, setOpenState] = useState(false);

    const open = openProp ?? openState;
    const setOpen = setOpenProp ?? setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function Sidebar({
    children,
    open,
    setOpen,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
}

export function SidebarBody(
    props: React.ComponentProps<typeof motion.div>
) {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
    );
}

export function DesktopSidebar({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) {
    const { open, setOpen, animate } = useSidebar();

    return (
        <motion.div
            className={cn(
                "hidden lg:flex h-full flex-col shrink-0 overflow-hidden px-3 py-4",
                className
            )}
            animate={{
                width: animate ? (open ? "260px" : "72px") : "260px",
            }}
            transition={{
                duration: 0.24,
                ease: [0.16, 1, 0.3, 1],
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function MobileSidebar({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const { open, setOpen } = useSidebar();

    return (
        <>
            <div
                className="flex h-14 w-full items-center justify-between px-4 lg:hidden"
                {...props}
            >
                <div className="z-20 flex w-full justify-end">
                    <IconMenu2
                        className="cursor-pointer text-neutral-200"
                        onClick={() => setOpen(!open)}
                    />
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={cn(
                                "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-[#120f0e] p-6",
                                className
                            )}
                        >
                            <div
                                className="absolute right-6 top-6 z-50 cursor-pointer text-neutral-200"
                                onClick={() => setOpen(false)}
                            >
                                <IconX />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export function SidebarLink({
    link,
    className,
    active = false,
    ...props
}: {
    link: SidebarLinkType;
    className?: string;
    active?: boolean;
}) {
    const { open, animate } = useSidebar();

    return (
        <a
            href={link.href}
            className={cn(
                "flex items-center rounded-xl transition-all duration-200",
                open ? "justify-start gap-3 px-3 py-3" : "justify-center px-0 py-3",
                active
                    ? "border border-orange-400/20 bg-orange-500/10 text-orange-300"
                    : "text-stone-400 hover:bg-[#1a1716] hover:text-white",
                className
            )}
            {...props}
        >
            {link.icon}

            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                transition={{ duration: 0.18 }}
                className="inline-block whitespace-pre !m-0 !p-0 font-sans text-sm font-medium"
            >
                {link.label}
            </motion.span>
        </a>
    );
}