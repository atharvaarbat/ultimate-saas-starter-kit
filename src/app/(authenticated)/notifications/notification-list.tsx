'use client';
import React from 'react';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

import NotificationCard from './notification-card';

const NotificationsList: React.FC = () => {
    // Example notification data - replace with your actual data
    const [notifications, setNotifications] = React.useState<Notification[]>([
        {
            id: 1,
            title: "New message from Sarah",
            description: "Hey, check out the new project proposal!",
            timestamp: new Date(),
            type: "message",
            isRead: false,
        },
        {
            id: 2,
            title: "Meeting reminder",
            description: "Team sync in 30 minutes",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            type: "calendar",
            isRead: false,
        },
        {
            id: 3,
            title: "New team member",
            description: "John Doe joined the design team",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            type: "user",
            isRead: true,
        },
        // Add more notifications as needed
    ]);

    // Function to group notifications by date
    const groupNotifications = (notifications: Notification[]) => {
        return notifications.reduce((groups: any, notification) => {
            let group;
            if (isToday(notification.timestamp)) {
                group = 'Today';
            } else if (isThisWeek(notification.timestamp)) {
                group = 'This Week';
            } else if (isThisMonth(notification.timestamp)) {
                group = 'This Month';
            } else {
                group = 'Older';
            }

            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(notification);
            return groups;
        }, {});
    };

    // Function to mark notification as read
    const markAsRead = (id: Number) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
        ));
    };

    const groupedNotifications: NotificationGroup = groupNotifications(notifications) as NotificationGroup;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <Button
                    variant="outline"
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                >
                    Mark all as read
                </Button>
            </div>

            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">{group}</h2>
                    <div className="space-y-4">
                        {groupNotifications.map((notification) => (
                            <NotificationCard notification={notification} key={notification.id} markAsRead={markAsRead} />
                        ))}
                    </div>
                </div>
            ))}

            {Object.keys(groupedNotifications).length === 0 && (
                <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
                </div>
            )}
        </div>
    );
};

export default NotificationsList;

export interface Notification {
    id: number;
    title: string;
    description: string;
    timestamp: Date;
    type: 'message' | 'calendar' | 'user' | 'default';
    isRead: boolean;
}

export type NotificationGroup = {
    [key in 'Today' | 'This Week' | 'This Month' | 'Older']: Notification[];
};