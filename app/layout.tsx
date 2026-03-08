import QueryProvider from "@/app/queryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";
import {Inter} from  'next/font/google';
const inter = Inter({subsets: ["latin"]})
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <QueryProvider>
            <main className="min-h-screen flex flex-col items-center bg-muted">
                <Suspense fallback={null}>{children}</Suspense>

            </main>
        </QueryProvider>
      </ThemeProvider>
      </body>
      </html>

  );
}
