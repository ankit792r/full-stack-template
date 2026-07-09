import { Button } from "@/components/ui/button";
import { NavMenu } from "@/components/atoms/nav-menu";
import NavigationSheet from "@/components/molecules/nav-sheet";

export default function NavbarComponent() {
    return (
        <nav className="h-16 border-b bg-background">
            <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
                <h1>Logo</h1>

                {/* Desktop Menu */}
                <NavMenu className="hidden md:block" />

                <div className="flex items-center gap-3">
                    <Button className="hidden sm:inline-flex" variant="outline">
                        Sign In
                    </Button>
                    <Button>Get Started</Button>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <NavigationSheet />
                    </div>
                </div>
            </div>
        </nav>
    );
};