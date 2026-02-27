import QueryProvider from "@/app/queryProvider";
import "./globals.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR">
      <body>
      <QueryProvider>
          <main className="min-h-screen flex flex-col items-center bg-muted">
              {children}

          </main>
      </QueryProvider>
      </body>
      </html>

  );
}
