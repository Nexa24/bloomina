import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=straighten,close,check,favorite" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        {isMaintenance ? (
          <Maintenance message={maintenanceMessage} />
        ) : (
          <AuthProvider>
            <Navbar />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
