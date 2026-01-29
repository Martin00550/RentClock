"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("rentclock_sidebar_collapsed");
        if (saved !== null) {
            setIsCollapsed(saved === "true");
        }
        setIsMounted(true);
    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("rentclock_sidebar_collapsed", String(isCollapsed));
        }
    }, [isCollapsed, isMounted]);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    // Prevent layout jump by only rendering children when mounted
    // or handle the SSR case carefully. For simplicity, we just provide the state.
    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setIsCollapsed }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
