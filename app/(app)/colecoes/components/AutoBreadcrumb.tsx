"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"

export default function AutoBreadcrumb() {
    const pathname = usePathname()

    const segments = pathname
        .split("/")
        .filter(Boolean)

    return (
        <div className="mb-6 text-sm text-muted-foreground">
            <nav className="flex items-center gap-2">
                <Link href="/" className="hover:underline">
                    Início
                </Link>

                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/")
                    const isLast = index === segments.length - 1

                    return (
                        <div key={segment} className="flex items-center gap-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="font-medium text-foreground capitalize">
                  {decodeURIComponent(segment)}
                </span>
                            ) : (
                                <Link href={href} className="hover:underline capitalize">
                                    {decodeURIComponent(segment)}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </nav>
        </div>
    )
}