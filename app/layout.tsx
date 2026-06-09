import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";

import { ThemeProvider } from "@/app/components/theme-provider";
import { ThemeScript } from "@/app/components/theme-script";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stoics AI",
  description: "Tenant-aware AI workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthKitProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
