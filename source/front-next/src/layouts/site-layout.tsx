// This will wrap the main content of the app

import NavbarComponent from "@/components/organisms/navbar";
import FooterComponent from "@/components/organisms/footer";

// it must be public and not authenticated to access this layout
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto w-full space-y-12">
            <NavbarComponent />
            <main className="max-w-(--breakpoint-xl) mx-auto w-full">
                {children}
            </main>
            <FooterComponent />
        </div>
    )
}