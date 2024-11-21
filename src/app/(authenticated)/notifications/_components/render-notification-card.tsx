'use client';
import React from 'react';
import InviteNotificationCard from './InviteNotificationCard';

const RenderNotificationCard = ({notification}: {notification: Notification}) => {
    if(notification.type === 'invite') 
        return <InviteNotificationCard notification={notification} />
}

export default RenderNotificationCard


export interface Notification {
    _id: string;
    data: any;
    createdAt: Date;
    type: 'message' | 'calendar' | 'user' | 'default' | 'invite';
    isRead: boolean;
    fromUserObj: any;
    allData: any;
}