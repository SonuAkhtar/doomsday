import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import { WatchedProvider } from "@/lib/WatchedContext";
import { MovieModalProvider } from "@/lib/MovieModalContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { DoomsdayBackdrop } from "@/components/DoomsdayBackdrop/DoomsdayBackdrop";
import { Header } from "@/components/Header/Header";
import { BottomNav } from "@/components/BottomNav/BottomNav";
import { Footer } from "@/components/Footer/Footer";

const bootScript = `try{if(localStorage.getItem('doomsday.theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-motion','on')}catch(e){}`;
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
    default: "Doomsday: The Marvel Watch Journey",
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
    title: "Doomsday: The Marvel Watch Journey",
    description:
      "The ultimate Marvel watch journey before Avengers: Doomsday. Track your progress through the films that matter.",
    siteName: "Doomsday",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doomsday: The Marvel Watch Journey",
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
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <ThemeProvider>
          <WatchedProvider>
            <MovieModalProvider>
              <DoomsdayBackdrop />
              <Header />
              <main className="app-main">{children}</main>
              <Footer />
              <BottomNav />
            </MovieModalProvider>
          </WatchedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
