"use client";

import { driver, DriveStep } from "driver.js";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import "driver.js/dist/driver.css";
import "./tutorial-styles.css";
import { usePathname } from "next/navigation";
import { HOME_STEPS, LEASES_STEPS, PROFIT_STEPS } from "@/lib/tutorial-steps";

interface TutorialContextType {
    startTour: (tourId: string) => void;
    completedTours: string[];
    resetTours: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
    startTour: () => { },
    completedTours: [],
    resetTours: () => { },
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [completedTours, setCompletedTours] = useState<string[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // LOAD STATE
    useEffect(() => {
        const saved = localStorage.getItem("rentclock_tutorials");
        if (saved) {
            setCompletedTours(JSON.parse(saved));
        }
        setHasLoaded(true);
    }, []);

    const markAsComplete = useCallback((tourId: string) => {
        setCompletedTours(prev => {
            if (prev.includes(tourId)) return prev;
            const newTours = [...prev, tourId];
            localStorage.setItem("rentclock_tutorials", JSON.stringify(newTours));
            return newTours;
        });
    }, []);

    const startTour = useCallback((tourId: string, steps: DriveStep[] = []) => {
        // If steps not provided, lookup based on ID
        let tourSteps = steps;
        if (tourSteps.length === 0) {
            if (tourId === "home") tourSteps = HOME_STEPS;
            if (tourId === "leases") tourSteps = LEASES_STEPS;
            if (tourId === "profit") tourSteps = PROFIT_STEPS;
        }

        const driverObj = driver({
            showProgress: true,
            steps: tourSteps,
            popoverClass: "driverjs-theme",
            animate: true,
            allowClose: true,
            doneBtnText: "Got it, thanks",
            nextBtnText: "Next Step",
            prevBtnText: "Back",
            onDestroyed: () => {
                markAsComplete(tourId);
            }
        });

        driverObj.drive();
    }, [markAsComplete]);

    const resetTours = useCallback(() => {
        setCompletedTours([]);
        localStorage.removeItem("rentclock_tutorials");
        alert("Tutorials reset! Refresh the page to see them again.");
    }, []);

    // AUTO-TRIGGER LOGIC
    useEffect(() => {
        if (!hasLoaded) return;

        const checkAndStart = (tourId: string, steps: DriveStep[]) => {
            if (!completedTours.includes(tourId)) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    startTour(tourId, steps);
                }, 800);
            }
        };

        if (pathname === "/dashboard" || pathname === "/") {
            checkAndStart("home", HOME_STEPS);
        } else if (pathname === "/leases") {
            checkAndStart("leases", LEASES_STEPS);
        } else if (pathname === "/profit-protection") {
            checkAndStart("profit", PROFIT_STEPS);
        }

    }, [pathname, hasLoaded, completedTours, startTour]);

    return (
        <TutorialContext.Provider value={{ startTour, completedTours, resetTours }}>
            {children}
        </TutorialContext.Provider>
    );
}
