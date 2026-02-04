"use client";

import { driver, DriveStep } from "driver.js";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import "driver.js/dist/driver.css";
import "./tutorial-styles.css";
import { usePathname } from "next/navigation";
import { HOME_STEPS, LEASES_STEPS, PROFIT_STEPS } from "@/lib/tutorial-steps";
import { getCompletedTutorials, markTutorialComplete } from "@/actions/tutorial-actions";
import { useUser } from "@clerk/nextjs";

interface TutorialContextType {
    startTour: (tourId: string) => void;
    completedTours: string[];
    resetTours: () => void;
    setHasOnboarded: (val: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType>({
    startTour: () => { },
    completedTours: [],
    resetTours: () => { },
    setHasOnboarded: () => { },
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn } = useUser();
    const pathname = usePathname();
    const [completedTours, setCompletedTours] = useState<string[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Blocking State
    const [isPro, setIsPro] = useState(false);
    const [hasOnboarded, setHasOnboarded] = useState(true); // Default true to not block unless confirmed false

    // LOAD STATE (Server First, no local storage fallback needed for persistent auth)
    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const loadState = async () => {
            const data = await getCompletedTutorials();
            setCompletedTours(data.seen_tutorials);
            setIsPro(data.is_pro);
            // Only update if explicit boolean, careful with undefined
            if (typeof data.has_onboarded === 'boolean') {
                setHasOnboarded(data.has_onboarded);
            }
            setHasLoaded(true);
        };

        loadState();
    }, [isLoaded, isSignedIn]);

    const markAsComplete = useCallback(async (tourId: string) => {
        // Optimistic update
        setCompletedTours(prev => {
            if (prev.includes(tourId)) return prev;
            return [...prev, tourId];
        });

        // Server update
        await markTutorialComplete(tourId);
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

        const drive = async () => {
            driverObj.drive();
        };
        drive();

    }, [markAsComplete]);

    const resetTours = useCallback(() => {
        setCompletedTours([]);
        alert("To reset tutorials permanently, an admin must clear your profile flag. This session is reset.");
    }, []);

    // AUTO-TRIGGER LOGIC
    useEffect(() => {
        if (!hasLoaded) return;

        // BLOCK: If user is Pro and hasn't onboarded, DO NOT show tutorials yet.
        // The OnboardingWizard will show instead.
        if (isPro && !hasOnboarded) {
            return;
        }

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

    }, [pathname, hasLoaded, completedTours, startTour, isPro, hasOnboarded]);

    return (
        <TutorialContext.Provider value={{ startTour, completedTours, resetTours, setHasOnboarded }}>
            {children}
        </TutorialContext.Provider>
    );
}
