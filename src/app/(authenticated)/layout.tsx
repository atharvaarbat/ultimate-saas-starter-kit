import Header from "@/components/navigation/header"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { getCuurentUser } from "@/server/action/auth";
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getCuurentUser();
    if (!session) {
        redirect('/login');
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
