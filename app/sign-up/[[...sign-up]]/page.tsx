import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-[#1e3a5f] hover:bg-[#2a4a73] text-sm normal-case",
                        card: "shadow-2xl border-slate-200 rounded-2xl"
                    }
                }}
            />
        </div>
    );
}
