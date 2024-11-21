'use client';
import React, { useEffect } from 'react';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { getNotificationsOfUser } from '@/server/action/notification';
import RenderNotificationCard from './_components/render-notification-card';

const NotificationsList: React.FC = () => {

    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    useEffect(() => {
        const fetchNotifications = async () => {
            const notifications = await getNotificationsOfUser();
            setNotifications(notifications);
        }
        fetchNotifications();
    }, [])

    const groupedNotifications: NotificationGroup = groupNotifications(notifications) as NotificationGroup;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                
            </div>

            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">{group}</h2>
                    <div className="space-y-4">
                        {groupNotifications.map((notification, index) => (
                            <RenderNotificationCard notification={notification} key={index} />
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
    _id: string;
    data: any;
    createdAt: Date;
    type: 'message' | 'calendar' | 'user' | 'default' | 'invite';
    isRead: boolean;
    fromUserObj: any;
    allData: any;
}

export type NotificationGroup = {
    [key in 'Today' | 'This Week' | 'This Month' | 'Older']: Notification[];
};


const groupNotifications = (notifications: Notification[]) => {
    return notifications.reduce((groups: any, notification) => {
        let group;
        if (isToday(notification.createdAt)) {
            group = 'Today';
        } else if (isThisWeek(notification.createdAt)) {
            group = 'This Week';
        } else if (isThisMonth(notification.createdAt)) {
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