import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";
import { AppChrome } from "@/components/AppChrome";
import { getCurrentUser, isAdminEmail } from "@/lib/supabase/auth-server";

export const metadata: Metadata = {
  title: "Coffee Express · Officina",
  description: "Accettazione e tracking riparazioni macchine da caffè",
  manifest: "/manifest.webmanifest",
  applicationName: "CE Officina",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CE Officina",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2320",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

function hasAuthEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = hasAuthEnv() ? await getCurrentUser() : null;
  const isAdmin = isAdminEmail(user?.email);

  return (
    <html lang="it">
      <body className="font-sans text-coffee-900 antialiased">
        <AppChrome isAdmin={isAdmin}>{children}</AppChrome>
        <InstallPrompt />
      </body>
    </html>
  );
}
