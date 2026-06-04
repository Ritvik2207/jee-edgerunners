import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEE Edgerunners",
  description: "A browser web app for JEE Main PCM planning, progress, mocks, and error repair."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
