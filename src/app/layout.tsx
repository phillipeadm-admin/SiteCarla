import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans-main" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif-main"
});

export const metadata: Metadata = {
  title: "Romagnolle - Forno & Confetteria",
  description: "Pães de fermentação natural e confeitaria fina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased bg-[#F5F2EC]`}>
        <Toast />
        {children}
      </body>
    </html>
  );
}
