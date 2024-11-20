import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import BreadcrumbComp from './breadcrumb'
import NotificationDropdown from './notification-dropdown'
import { ModeToggle } from '../theme-toggle'
const Header = () => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className='flex items-center w-full justify-between px-4'>
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <BreadcrumbComp />
                </div>
                <div className='flex gap-2'>
                    <ModeToggle/>
                    <NotificationDropdown/>
                </div>
            </div>

        </header>
    )
}

export default Header