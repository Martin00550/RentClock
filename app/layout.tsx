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
  title: "RentClock | Portfolio Safety Net",
  description: "Professional-grade commercial lease tracking. Automated alerts for rent increases and expirations to protect your portfolio revenue.",
  metadataBase: new URL("https://rentclock.online"),
  keywords: ["commercial real estate", "lease tracking", "rent increase", "landlord software", "portfolio protection"],
  authors: [{ name: "RentClock Team" }],
  openGraph: {
    title: "RentClock | Portfolio Safety Net",
    description: "Never miss a commercial rent increase again. The 'silent alarm' for your lease portfolio.",
    url: "https://rentclock.online",
    siteName: "RentClock",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentClock - Portfolio Safety Net",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentClock | Portfolio Safety Net",
    description: "The professional's vault for commercial lease management.",
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
          <NextTopLoader color="#4f46e5" showSpinner={false} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
