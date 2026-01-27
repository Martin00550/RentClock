"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignUpTrigger({ children, className, redirectUrl = "/dashboard" }: { children: React.ReactNode, className?: string, redirectUrl?: string }) {
    const { isSignedIn } = useUser();
    const router = useRouter();

    if (isSignedIn) {
        return (
            <div onClick={() => router.push(redirectUrl)} className={`cursor-pointer ${className || ""}`}>
                {children}
            </div>
        );
    }

    return (
        <div className={className}>
            <SignUpButton mode="modal" forceRedirectUrl={redirectUrl}>
                {children}
            </SignUpButton>
        </div>
    );
}
