import type { Metadata } from "next";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Garfagnanafoto Wedding | Fotografia e Video Matrimoniale d'Eccellenza",
  description: "Servizi di alta qualità per il tuo giorno speciale in Garfagnana e Toscana. Preventivi immediati e pacchetti personalizzati.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="font-sans">{children}</body>
    </html>
  );
}
