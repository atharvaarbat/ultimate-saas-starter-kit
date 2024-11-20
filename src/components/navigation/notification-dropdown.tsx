import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NotificationsList from '@/app/(authenticated)/notifications/notification-list'
import { Button } from '../ui/button'
import { Bell } from 'lucide-react'
const NotificationDropdown = () => {
    return (
        <Popover >
            <PopoverTrigger>
                <Button size={"icon"} variant='outline'>
                    <Bell size={18}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent sideOffset={8} align='end' className='max-h-[70vh] overflow-y-auto w-[500px] drop-shadow-xl'>
                <NotificationsList/>
            </PopoverContent >
        </Popover>
    )
}

export default NotificationDropdown