import type { Metadata } from "next";
import "./globals.css";

const title = "Wenzzday Robotics — Self-learning quality inspection for automotive manufacturing";
const description =
  "AI that catches assembly errors on engine and component lines, and learns every new part on its own.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Wenzzday Robotics",
  openGraph: {
    type: "website",
    siteName: "Wenzzday Robotics",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
