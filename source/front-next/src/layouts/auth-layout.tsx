// This will wrap the auth content of the app

import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

// it must be public and not authenticated to access this layout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm space-y-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Lincly Labs.
                </Link>

                {children}
            </div>
        </div>
    )
}