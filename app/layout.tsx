import QueryProvider from "@/app/queryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR" suppressHydrationWarning>
      <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
            <main className="min-h-screen flex flex-col items-center bg-muted">
                {children}

            </main>
        </QueryProvider>
      </ThemeProvider>
      </body>
      </html>

  );
}
