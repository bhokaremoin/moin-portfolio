import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { inter, jetbrains, sourceSerif } from "@/lib/fonts";
import {
  DEFAULT_THEME,
  THEME_COOKIE_KEY,
  ThemeId,
  isThemeId,
} from "@/lib/portfolio-data";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://moin-portflio.vercel.app"),
  title: "Moin Bhokare — Portfolio",
  description:
    "Full-stack developer at BrowserStack. Three coder-aesthetic themes, one portfolio.",
  openGraph: {
    title: "Moin Bhokare — Portfolio",
    description:
      "Full-stack developer at BrowserStack. Three coder-aesthetic themes, one portfolio.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moin Bhokare — Portfolio",
    description:
      "Full-stack developer at BrowserStack. Three coder-aesthetic themes, one portfolio.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(THEME_COOKIE_KEY)?.value;
  const initialTheme: ThemeId = isThemeId(cookieValue) ? cookieValue : DEFAULT_THEME;

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${jetbrains.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider initialTheme={initialTheme}>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <ThemeSwitcher />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
