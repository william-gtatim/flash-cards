"use client";

import { usePathname } from "next/navigation";

import HeaderMain from "./components/header/header";
import HeaderEstudar from "./estudar/components/headerEstudar";
import { StudyHeaderProvider } from "./estudar/components/studyHeaderContext";



export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudyRoute = pathname?.startsWith("/estudar");

  if (isStudyRoute) {
    return (
      <StudyHeaderProvider>
        <div className="flex-1 w-full flex flex-col items-center">
          <HeaderEstudar />
          <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
            {children}
          </div>
        </div>
      </StudyHeaderProvider>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <HeaderMain />
      <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
        {children}
      </div>
    </div>

  );
}
