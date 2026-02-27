import Link from "next/link";

import {ThemeSwitcher} from "@/components/theme-switcher";
import UserMenu from "@/app/(app)/components/header/userMenu";

export default function Header(){
    return (
        <header className="w-full border-b border-b-foreground/10 bg-background  h-16 sticky top-0 ">
            <nav className="w-full flex justify-center ">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                        <Link href={"/"}>FlashCards</Link>
                    </div>
                   <div className="flex gap-3 items-center">
                       <ThemeSwitcher />
                       <UserMenu />
                   </div>
                </div>
            </nav>
        </header>
    )
}