import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import MetaPixel from "@/components/MetaPixel";
import Maintenance from "@/components/Maintenance";

export const metadata: Metadata = {
  title: "Bloomina | Feel Every Moment",
  description: "Premium innerwear and apparel designed for comfort and elegance.",
  icons: {
    icon: "/logo/BLO_TRNSP_LOVE_ICON.png",
    apple: "/logo/BLO_TRNSP_LOVE_ICON.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check for maintenance mode
  let isMaintenance = false;
  let maintenanceMessage = "";

  try {
    const { data } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'storefront_status')
      .single();

    if (data?.value && data.value.online === false) {
      isMaintenance = true;
      maintenanceMessage = data.value.message;
    }
  } catch (error) {
    console.error("Maintenance check failed:", error);
  }

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Manrope:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-xs font-bold uppercase tracking-widest"
        >
          Skip to main content
        </a>
        <MetaPixel />
        {isMaintenance ? (
          <Maintenance message={maintenanceMessage} />
        ) : (
          <AuthProvider>
            <Navbar />
            <main id="main-content" className="pt-20" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
