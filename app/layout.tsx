import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import { WatchedProvider } from "@/lib/WatchedContext";
import { MovieModalProvider } from "@/lib/MovieModalContext";
import { Header } from "@/components/Header/Header";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import "./globals.css";

const displayFont = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-face",
  display: "swap",
});

const siteUrl = "https://doomsday-journey.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Doomsday — The Marvel Watch Journey",
    template: "%s · Doomsday",
  },
  description:
    "Track exactly which Marvel movies to watch before Avengers: Doomsday. Follow a curated cinematic journey, mark films as watched, and see your progress.",
  applicationName: "Doomsday",
  keywords: [
    "Marvel",
    "Avengers Doomsday",
    "MCU watch order",
    "Multiverse Saga",
    "watch tracker",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Doomsday — The Marvel Watch Journey",
    description:
      "The ultimate Marvel watch journey before Avengers: Doomsday. Track your progress through the films that matter.",
    siteName: "Doomsday",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doomsday — The Marvel Watch Journey",
    description:
      "Track which Marvel movies to watch before Avengers: Doomsday.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Doomsday",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <WatchedProvider>
          <MovieModalProvider>
            <Header />
            <main className="app-main">{children}</main>
            <BottomNav />
          </MovieModalProvider>
        </WatchedProvider>
      </body>
    </html>
  );
}
