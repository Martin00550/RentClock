"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignInTrigger({ children, className }: { children: React.ReactNode, className?: string }) {
    const { isSignedIn } = useUser();
    const router = useRouter();

    if (isSignedIn) {
        return (
            <div onClick={() => router.push("/dashboard")} className={`cursor-pointer ${className || ""}`}>
                {children}
            </div>
        );
    }

    return (
        <div className={className}>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                {children}
            </SignInButton>
        </div>
    );
}
