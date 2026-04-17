import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { ThemeToggle } from "@/components/theme-toggle";
import { LlmPopupMount } from "@/features/public/ui/llm-popup/llm-popup-mount";

export const metadata: Metadata = {
  title: "Feranmi Adeniji",
  description: "Senior Software Engineer — building things that matter.",
  metadataBase: new URL("https://devferanmi.xyz"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ThemeToggle />
          {children}
          <LlmPopupMount />
        </ThemeProvider>
      </body>
    </html>
  );
}
