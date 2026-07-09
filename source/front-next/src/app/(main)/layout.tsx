import MainLayout from "@/layouts/main-layout";

export const ssr = false;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    )
}