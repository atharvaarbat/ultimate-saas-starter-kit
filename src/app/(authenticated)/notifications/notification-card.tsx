'use client';
import React from 'react';
import { formatDistanceToNow, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Bell, Check, MoreVertical, Mail, Calendar, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NotificationCard = ({notification, markAsRead}: {notification: Notification, markAsRead: (id: Number) => void}) => {
    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message':
                return <Mail className="h-4 w-4" />;
            case 'calendar':
                return <Calendar className="h-4 w-4" />;
            case 'user':
                return <UserPlus className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };
    return (
        <Card
            key={notification.id}
            className={`transition-colors ${notification.isRead ? 'bg-background/20' : 'bg-background'}`}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-2 h-fit rounded-full ${notification.isRead ? 'bg-muted' : 'bg-muted/50'}`}>
                            {getIcon(notification.type)}
                        </div>
                        <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!notification.isRead && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                                <DropdownMenuItem>Mute</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default NotificationCard


export interface Notification {
    id: number;
    title: string;
    description: string;
    timestamp: Date;
    type: 'message' | 'calendar' | 'user' | 'default';
    isRead: boolean;
}