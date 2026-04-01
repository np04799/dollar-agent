import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dollar Rate Agent",
  description: "Checking the dollar rate daily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}