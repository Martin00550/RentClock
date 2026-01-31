import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from 'nextjs-toploader';
import { StructuredData } from "@/components/landing/structured-data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "RentClock | Commercial Lease Tracker & Management Software",
  description: "Track lease expirations, rent increases, and critical dates. The simple lease management software for commercial landlords. Start free.",
  metadataBase: new URL("https://rentclock.online"),
  keywords: ["lease tracker", "commercial lease tracker", "lease management software", "commercial real estate software", "rent increase tracker", "lease administration", "landlord software"],
  authors: [{ name: "RentClock Team" }],
  openGraph: {
    title: "RentClock | Commercial Lease Tracker & Management Software",
    description: "Track lease expirations and rent increases. The simple lease management software for commercial landlords.",
    url: "https://rentclock.online",
    siteName: "RentClock",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentClock - Commercial Lease Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentClock | Commercial Lease Tracker",
    description: "The simple lease management software for commercial landlords.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentClock",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>

          <meta name="theme-color" content="#1e3a5f" />
          <link rel="apple-touch-icon" href="/icon-192.png" />
          <StructuredData />
        </head>
        <body className={`${manrope.variable} font-sans antialiased`} suppressHydrationWarning>
          <NextTopLoader color="#d4a853" showSpinner={false} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
