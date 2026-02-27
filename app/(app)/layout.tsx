import Header from "@/app/(app)/components/header/header";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex-1 w-full flex flex-col items-center">
          <Header/>
          <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
              {children}
          </div>
      </div>

  );
}
