'use client'

import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon,} from "lucide-react"
import Avatar from "@/app/(app)/components/header/avatar";


export default function UserMenu(){
    const router = useRouter();

    async function logout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Avatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon />
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCardIcon />
                    Cobrança
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon />
                    Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={logout}>
                    <LogOutIcon />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

