"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { Notification } from "../schema/notification";
import { verifySession } from "@/lib/statelessSession";
import { User } from "../schema/user";
import { ToClientObj } from "@/lib/utils";
import { Organization } from "../schema/organization";
import { Membership } from "../schema/memberships";

export async function createInviteNotification(
  fromUserEmail: string,
  toUserEmail: string,
  organizationId: string
) {
  try {
    await connectToDatabase();
    
    const notification = await Notification.create({
      type: "invite",
      fromUserEmail,
      toUserEmail,
      data: {
        organizationId,
        accepted: false,
      },
    });
    return notification;
  } catch (error) {
    console.error("Create Invite error:", error);
    throw error;
  }
}

export async function getNotificationsOfUser(userId?: string) {
  try {
    await connectToDatabase();
    if (!userId) {
      userId = (await verifySession()).userId;
    }
    const user = await User.findById(userId);
    const notifications = await Notification.find({ toUserEmail: user.email });

    // Use Promise.all to handle async mapping
    const fullNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const fromUser = await User.findOne({email: notification.fromUserEmail});
        const fromUserObj = {
          _id: fromUser._id,
          name: fromUser.name,
          email: fromUser.email,
          avatar: fromUser.avatar,
        };
        const allData = await getDataofNotification(notification.data, notification.type);
        const notificationObj = notification.toObject();
        return {
          ...notificationObj,
          fromUserObj,
          allData,
        };
      })
    );
    return JSON.parse(JSON.stringify(fullNotifications));
  } catch (error) {
    console.error("Get notifications error:", error);
    throw error;
  }
}

async function getDataofNotification(data: any, type: string) {
  try {
    await connectToDatabase();
    if (type === "invite") {
      const organization = await Organization.findById(data.organizationId);
      const organizationObj = {
        _id: organization._id,
        name: organization.name,
        slug: organization.slug,
      };
      return (organizationObj);
    }
  } catch (error) {
    console.error("Get notifications error:", error);
    throw error;
  }
}


export async function acceptOrgInvitation(
  organizationId: string, 
  notificationId: string, 
  invitedBy: string
) {
  try {
    await connectToDatabase();
    // Verify session and get userId
    const userId = (await verifySession()).userId;

    // Update notification with accepted status
    const notification = await Notification.findByIdAndUpdate(
      notificationId, 
      {
        // Use $set to ensure proper update of nested fields
        $set: {
          'data.accepted': true,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    // Check if notification exists
    if (!notification) {
      throw new Error('Notification not found');
    }

    // Create membership
    // Check if membership already exists
    const existingMembership = await Membership.findOne({
      userId,
      organizationId,
      status: 'active'
    });

    // Create membership only if it doesn't already exist
    let membership = existingMembership;
    if (!existingMembership) {
      membership = await Membership.create({
        userId,
        organizationId,
        role: "member",
        status: "active",
        invitedBy
      });
    }

    // Optionally, you might want to return both notification and membership
    return notification ? 'Success' : 'Failed';

  } catch (error) {
    console.error("Accept organization invitation error:", error);
    throw error;
  }
}