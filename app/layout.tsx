import type { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/app/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "DeenConnect",
  description: "Discover, submit, and manage Muslim community events in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

