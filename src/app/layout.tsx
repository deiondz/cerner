import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import Providers from "~/lib/provider";

export const metadata: Metadata = {
  title: "Cerner",
  description:
    "Cerner is a smart waste tracking system that improves Mangalore’s door-to-door garbage collection by reducing manual effort, enhancing real-time monitoring for health officers, and increasing citizen participation through automation and better data visibility.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" className={`${geist.variable}`}>
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
