import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">404 - Page Not Found</h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/">
                <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-slate-900/10">
                    Go Home
                </Button>
            </Link>
        </div>
    );
}
