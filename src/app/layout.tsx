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
      { url: "/icons/chameleon.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/chameleon.png", sizes: "57x57", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "60x60", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "76x76", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "114x114", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "120x120", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/chameleon.png", sizes: "152x152", type: "image/png" },
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
    { media: "(prefers-color-scheme: light)", color: "#f8fbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1f1c" },
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
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/chameleon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/chameleon.png" />
        <link rel="shortcut icon" href="/icons/chameleon.png" />
        {/* iOS specific meta tags for home screen app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Chameleon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/chameleon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/chameleon.png" />
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
