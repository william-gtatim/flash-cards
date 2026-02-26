import Header from "@/app/components/header/header";
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
              <div className="flex-1 w-full flex flex-col items-center">
                  <Header/>
                  <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
                      {children}
                  </div>
              </div>

          </main>
      </QueryProvider>
      </body>
      </html>

  );
}
