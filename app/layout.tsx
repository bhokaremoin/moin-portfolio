import type { Metadata, Viewport } from "next";
import { inter, jetbrains, sourceSerif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://moin-portflio.vercel.app"),
  title: "Moin Bhokare — Portfolio",
  description:
    "Full-stack developer at BrowserStack. A résumé and an interactive CLI, same story two ways.",
  openGraph: {
    title: "Moin Bhokare — Portfolio",
    description:
      "Full-stack developer at BrowserStack. A résumé and an interactive CLI, same story two ways.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moin Bhokare — Portfolio",
    description:
      "Full-stack developer at BrowserStack. A résumé and an interactive CLI, same story two ways.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrains.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
