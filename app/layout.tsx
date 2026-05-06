import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "Bloomina | Feel Every Moment",
  description: "Premium innerwear and apparel designed for comfort and elegance.",
  icons: {
    icon: "/logo/BLO_TRNSP_LOVE_ICON.png",
    apple: "/logo/BLO_TRNSP_LOVE_ICON.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=straighten,close,check,favorite" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
