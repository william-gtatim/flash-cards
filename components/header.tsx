import { ReactNode } from "react"

type HeaderProps = {
    children: ReactNode
}

export default function Header({ children }: HeaderProps) {
    return (
        <header className="w-full border-b border-b-foreground/10 bg-background min-h-16 sticky top-0 z-50">
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm gap-2">
                    {children}
                </div>
            </div>
            
        </header>
    )
}
