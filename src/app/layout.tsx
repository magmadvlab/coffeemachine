import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Express · Officina",
  description: "Accettazione e tracking riparazioni macchine da caffè",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};
export const viewport: Viewport = {
  themeColor: "#5b3a29", width: "device-width", initialScale: 1, maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="font-sans text-coffee-900 antialiased">{children}</body>
    </html>
  );
}
