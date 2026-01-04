import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GameProvider } from "@/lib/game-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chameleon - Party Game",
  description:
    "A fun party game where players try to identify the chameleon among them. Perfect for game nights and social gatherings!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chameleon",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Chameleon - Party Game",
    description:
      "A fun party game where players try to identify the chameleon among them!",
    type: "website",
    siteName: "Chameleon Game",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chameleon - Party Game",
    description:
      "A fun party game where players try to identify the chameleon among them!",
  },
  icons: {
    icon: [
      { url: "/icons/chameleon.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/chameleon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* iOS specific meta tags for home screen app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Chameleon" />
        <link rel="apple-touch-icon" href="/icons/chameleon.png" />
        {/* Prevent iOS from styling phone numbers as links */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
