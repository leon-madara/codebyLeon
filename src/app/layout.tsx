import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { BrandHandCursor } from "@/components/brand-hand-cursor";
import { SITE_DESCRIPTION, SITE_URL, socialMetadata } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  preload: false,
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  preload: false,
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CodeByLeon — Bold Websites for Driven Brands | Nairobi Design Studio",
  description: SITE_DESCRIPTION,
  keywords: [
    "CodeByLeon",
    "Nairobi web design",
    "custom websites",
    "React TypeScript",
    "digital identity",
    "web applications",
    "Leon Madara",
  ],
  authors: [{ name: "Leon Madara" }],
  ...socialMetadata("CodeByLeon — Bold Websites for Driven Brands", SITE_DESCRIPTION, "/"),
};

export default function RootLayout({
  children,
  intake,
}: Readonly<{
  children: React.ReactNode;
  intake: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${fraunces.variable} bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {intake}
          <BrandHandCursor />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
