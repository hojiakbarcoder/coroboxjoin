import type { Metadata } from "next"
import ConvexClientProvider from '../components/ConvexClientProvider'
import "./globals.css"

export const metadata: Metadata = {
  title: "Corobox — Edge-AI Packaging Quality Control",
  description:
    "Over-the-line Edge-AI vision inspection for food, beverage, and pharmaceutical packaging lines. Zero CapEx, sub-2-hour deployment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
