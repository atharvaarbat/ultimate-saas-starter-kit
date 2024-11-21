'use client';
import React from 'react';
import { formatDistanceToNow, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Bell, Check, MoreVertical, Mail, Calendar, UserPlus, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { acceptOrgInvitation } from '@/server/action/notification';

const InviteNotificationCard = ({ notification }: { notification: Notification }) => {
    const acceptInvite = async () => {
        const invit = await acceptOrgInvitation(notification.data.organizationId, notification._id, notification.fromUserObj._id)
        window.location.reload()
    }
    return (
        <Card
            key={notification._id}
            className={`transition-colors ${notification.isRead ? 'bg-background/20' : 'bg-background'}`}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-2 h-fit rounded-full ${notification.isRead ? 'bg-muted' : 'bg-muted/50'}`}>
                            <Building2 size={18} />
                        </div>
                        <div>
                            <p className="text-sm">You have an invitaion to join {notification.allData.name} </p>
                            <p className="text-sm text-muted-foreground">from {notification.fromUserObj.name} </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {
                            notification.data.accepted === false && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => acceptInvite()}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )
                        }
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default InviteNotificationCard


export interface Notification {
    _id: string;
    data: any;
    createdAt: Date;
    type: 'message' | 'calendar' | 'user' | 'default' | 'invite';
    isRead: boolean;
    fromUserObj: any;
    allData: any;
}