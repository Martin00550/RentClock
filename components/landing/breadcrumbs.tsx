import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Schema.org structured data for BreadcrumbList
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rentclock.online"
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                "item": `https://rentclock.online${item.href}`
            }))
        ]
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ol className="flex items-center gap-2 text-sm text-slate-500">
                <li>
                    <Link href="/" className="flex items-center gap-1 hover:text-[#1e3a5f] transition-colors">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                        {index === items.length - 1 ? (
                            <span className="font-semibold text-[#1e3a5f] truncate max-w-[200px] md:max-w-none" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-[#1e3a5f] transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
