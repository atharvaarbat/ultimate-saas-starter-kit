'use client'
import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getOrganizationsCurrUser } from "@/server/action/memberships"
import { IOrganization } from "@/server/action/organization"
import { getCuurentUser } from "@/server/action/auth"

// Fallback image generator function
const getFallbackLogo = (name?: string) =>
    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name || 'SO')}`;

export function OrgSwitcher() {
    const { isMobile } = useSidebar()
    const [activeOrg, setActiveOrg] = React.useState<IOrganization | null>(null)
    const [orgs, setOrgs] = React.useState<IOrganization[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Memoized org selection handler
    const handleOrgSelect = React.useCallback((org: IOrganization) => {
        setActiveOrg(org)
        localStorage.setItem("organization", JSON.stringify(org._id))
    }, [])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getCuurentUser();
                setIsLoading(true)
                if (!session) {
                    setActiveOrg(null)
                    setOrgs([])
                    return
                }
                const allOrgs = await getOrganizationsCurrUser()

                // Handle case with no organizations
                if (allOrgs.length === 0) {
                    setOrgs([])
                    setActiveOrg(null)
                    return
                }

                setOrgs(allOrgs)

                // Retrieve stored organization
                const storedOrgId = localStorage.getItem("organization")?.replace(/"/g, "")

                // Find active org
                const selectedOrg = storedOrgId
                    ? allOrgs.find(org => org._id === storedOrgId)
                    : allOrgs[0]

                setActiveOrg(selectedOrg || null)
            } catch (error) {
                // console.error("Failed to fetch organizations:", error)
                setOrgs([])
                setActiveOrg(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Loading state
    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="animate-pulse flex items-center space-x-4 w-full">
                        <div className="bg-gray-300 h-8 w-8 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // No organizations state
    if (!activeOrg || orgs.length === 0) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        onClick={() => redirect('/organization/new')}
                        className="w-full justify-center"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Organization
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground outline-none">
                                <img
                                    src={activeOrg.logo || getFallbackLogo(activeOrg.name)}
                                    alt={`${activeOrg.name} logo`}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeOrg.name}
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
                        {orgs.map((org, index) => (
                            <DropdownMenuItem
                                key={org._id}
                                onSelect={() => handleOrgSelect(org)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                                    <img
                                        src={org.logo || getFallbackLogo(org.name)}
                                        alt={`${org.name} logo`}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                {org.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2"
                            onSelect={() => redirect('/organization/new')}
                        >
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