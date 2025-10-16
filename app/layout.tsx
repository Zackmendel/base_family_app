import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamFunds - Family Financial Management",
  description:
    "A collaborative family financial management app for pooling resources, tracking expenses, and making collective financial decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
