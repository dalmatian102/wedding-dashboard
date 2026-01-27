import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding RSVP Dashboard",
  description: "Track wedding RSVP responses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
