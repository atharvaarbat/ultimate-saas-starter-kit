"use client"
import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getOrganizationsByUser, getOrganizationsCurrUser, IOrganizationWithMembership } from "@/server/action/memberships"
import { getSession } from "@/lib/statelessSession"
import Image from "next/image"
import { IOrganization } from "@/server/action/organization"

export function OrgSwitcher() {
    const { isMobile } = useSidebar()
    const [activeOrg, setActiveOrg] = React.useState<IOrganization>()
    const [orgs, setOrgs] = React.useState<IOrganization[]>([])
    React.useEffect(() => {
        const fetchData = async () => {
            const allOrgs = await getOrganizationsCurrUser();
            setOrgs(allOrgs);
            const activeOrgId = localStorage.getItem("organization")?.replace(/"/g, "");
            if (!activeOrgId) {
                setActiveOrg(allOrgs[0]);
                localStorage.setItem("organization", allOrgs[0]._id);
            }
            const myactiveOrg = allOrgs.filter((org) => org._id === activeOrgId);
            setActiveOrg(myactiveOrg[0]);

        }
        fetchData();
    }, [])
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground outline-none">

                                <img src={activeOrg?.logo ? activeOrg.logo : 'https://api.dicebear.com/8.x/initials/svg?seed=S%20O'} width={40} height={40} className="rounded" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeOrg?.name ? activeOrg.name : "Select Organization"}
                                </span>

                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizations
                        </DropdownMenuLabel>
                        {orgs?.map((org, index) => (
                            <DropdownMenuItem
                                key={org.name}
                                onClick={() => {
                                    setActiveOrg(org)
                                    localStorage.setItem("organization", org._id)
                                }}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                                    <img src={org.logo ? org.logo : undefined} width={40} height={40} className="" />

                                </div>
                                {org.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={() => redirect('/organization/new')}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Create organization</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
