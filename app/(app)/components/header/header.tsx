import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import {ThemeSwitcher} from "@/components/theme-switcher";
import UserMenu from "@/app/(app)/components/header/userMenu";

export default function HeaderMain(){
    return (
        <Header>
            <div className="flex gap-5 items-center ">
                <Link href={"/"} aria-label="Início" className="flex items-center gap-2">
                    <Image
                        src="/imagens/logo-card.svg"
                        alt="FlashCards"
                        width={90}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                    <span className="font-semibold text-xl leading-none">Flash Code</span>
                </Link>
            </div>
            <div className="flex gap-3 items-center">
                <ThemeSwitcher />
                <UserMenu />
            </div>
        </Header>
    )
}

