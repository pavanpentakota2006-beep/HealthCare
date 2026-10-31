import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "HealthCare Dashboard",
  description: "Advanced AI Health & Nutrition App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <UserProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </UserProvider>
      </body>
    </html>
  );
}
