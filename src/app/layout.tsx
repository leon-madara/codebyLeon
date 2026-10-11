import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CodeByLeon — Bold Websites for Driven Brands | Nairobi Design Studio",
  description:
    "Custom websites, website redesigns, and online tools for your business. Work directly with Leon in Nairobi, Kenya.",
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
  openGraph: {
    title: "CodeByLeon — Bold Websites for Driven Brands",
    description:
      "Websites that explain what you do, work well on phones, and help customers get in touch. Based in Nairobi, working with clients worldwide.",
    siteName: "CodeByLeon",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
