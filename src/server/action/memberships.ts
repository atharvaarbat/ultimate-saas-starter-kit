'use server'

import { Membership } from '@/server/schema/memberships';
import { Organization } from '@/server/schema/organization';
import { User } from '@/server/schema/user';
import { connectToDatabase } from '@/lib/mongodb';
import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/statelessSession';
import { IOrganization } from './organization';
import { ToClientObj } from '@/lib/utils';

// Types
export interface ICreateMembership {
  userId: string;
  organizationId: string;
  role?: 'admin' | 'member' | 'owner';
  status?: 'active' | 'inactive' | 'pending';
  invitedBy?: string;
}

export interface IUpdateMembership {
  role?: 'admin' | 'member' | 'owner';
  status?: 'active' | 'inactive' | 'pending';
}

export interface IMembershipResponse {
  _id: string;
  userId: string;
  organizationId: string;
  role: 'admin' | 'member' | 'owner';
  status: 'active' | 'inactive' | 'pending';
  invitedBy?: string;
  invitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationWithMembership extends IMembershipResponse {
  organization: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
  };
}

// Create a new membership
export async function createMembership(membershipData: ICreateMembership): Promise<IMembershipResponse> {
  try {
    await connectToDatabase();

    // Validate user and organization exist
    const [user, organization, existingMembership] = await Promise.all([
      User.findById(membershipData.userId),
      Organization.findById(membershipData.organizationId),
      Membership.findOne({
        userId: membershipData.userId,
        organizationId: membershipData.organizationId
      })
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!organization) {
      throw new Error('Organization not found');
    }

    if (existingMembership) {
      throw new Error('Membership already exists');
    }

    // Create membership
    const membership = await Membership.create({
      ...membershipData,
      status: membershipData.status || 'pending',
      role: membershipData.role || 'member'
    });

    revalidatePath(`/organizations/${organization.slug}/members`);
    return JSON.parse(JSON.stringify(membership.toObject() )) as IMembershipResponse;
  } catch (error) {
    console.error('Create membership error:', error);
    throw error;
  }
}

// Get organizations by user
export async function getOrganizationsByUser(userId: string): Promise<IOrganizationWithMembership[]> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const memberships = await Membership.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'organizations', // Make sure this matches your collection name
          localField: 'organizationId',
          foreignField: '_id',
          as: 'organization'
        }
      },
      { $unwind: '$organization' },
      {
        $project: {
          _id: 1,
          userId: 1,
          organizationId: 1,
          role: 1,
          status: 1,
          invitedBy: 1,
          invitedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          'organization._id': 1,
          'organization.name': 1,
          'organization.slug': 1,
          'organization.description': 1,
          'organization.logo': 1,
          'organization.website': 1
        }
      }
    ]);

    return memberships as IOrganizationWithMembership[];
  } catch (error) {
    console.error('Get organizations by user error:', error);
    throw error;
  }
}
// Get organizations of active user
// export async function getOrganizationsCurrUser(): Promise<IOrganizationWithMembership[]> {
//   try {
//     await connectToDatabase();
//     const userId = (await verifySession()).userId || '';
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new Error('Invalid user ID');
//     }

//     const memberships = await Membership.aggregate([
//       { $match: { userId: new Types.ObjectId(userId) } },
//       {
//         $lookup: {
//           from: 'organizations', // Make sure this matches your collection name
//           localField: 'organizationId',
//           foreignField: '_id',
//           as: 'organization'
//         }
//       },
//       { $unwind: '$organization' },
//       {
//         $project: {
//           _id: 1,
//           userId: 1,
//           organizationId: 1,
//           role: 1,
//           status: 1,
//           invitedBy: 1,
//           invitedAt: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           'organization._id': 1,
//           'organization.name': 1,
//           'organization.slug': 1,
//           'organization.description': 1,
//           'organization.logo': 1,
//           'organization.website': 1
//         }
//       }
//     ]);

//     return JSON.parse(JSON.stringify(memberships)) as IOrganizationWithMembership[];
//   } catch (error) {
//     console.error('Get organizations by user error:', error);
//     throw error;
//   }
// }

export async function getOrganizationsCurrUser(): Promise<IOrganization[]> {
  try {
    await connectToDatabase();
    const userId = (await verifySession()).userId || '';
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const memberships = await Membership.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'organizations',
          localField: 'organizationId',
          foreignField: '_id',
          as: 'organization'
        }
      },
      { $unwind: '$organization' },
      {
        $project: {
          'organization._id': 1,
          'organization.name': 1,
          'organization.slug': 1,
          'organization.description': 1,
          'organization.logo': 1,
          'organization.website': 1
        }
      },
      {
        // Extract just the organization object
        $replaceRoot: { newRoot: '$organization' }
      }
    ]);

    return JSON.parse(JSON.stringify(memberships)) as IOrganization[];
  } catch (error) {
    console.error('Get organizations by user error:', error);
    throw error;
  }
}
// Get users by organization
export async function getUsersByOrganization(organizationId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(organizationId)) {
      throw new Error('Invalid organization ID');
    }

    const memberships = await Membership.aggregate([
      { $match: { organizationId: new Types.ObjectId(organizationId) } },
      {
        $lookup: {
          from: 'users', // Make sure this matches your collection name
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          role: 1,
          status: 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1
        }
      }
    ]);

    return memberships;
  } catch (error) {
    console.error('Get users by organization error:', error);
    throw error;
  }
}

// Update membership
export async function updateMembership(
  membershipId: string, 
  updateData: IUpdateMembership
): Promise<IMembershipResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(membershipId)) {
      throw new Error('Invalid membership ID');
    }

    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      { 
        ...updateData, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!membership) return null;

    const org = await Organization.findById(membership.organizationId);
    revalidatePath(`/organizations/${org?.slug}/members`);

    return membership.toObject() as IMembershipResponse;
  } catch (error) {
    console.error('Update membership error:', error);
    throw error;
  }
}

// Delete membership
export async function deleteMembership(membershipId: string): Promise<boolean> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(membershipId)) {
      throw new Error('Invalid membership ID');
    }

    const membership = await Membership.findByIdAndDelete(membershipId);
    
    if (membership) {
      const org = await Organization.findById(membership.organizationId);
      revalidatePath(`/organizations/${org?.slug}/members`);
    }

    return !!membership;
  } catch (error) {
    console.error('Delete membership error:', error);
    throw error;
  }
}

// Check if user is a member of an organization
export async function checkMembership(userId: string, organizationId: string): Promise<IMembershipResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(organizationId)) {
      throw new Error('Invalid user or organization ID');
    }

    const membership = await Membership.findOne({ 
      userId, 
      organizationId 
    });

    return membership ? membership.toObject() as IMembershipResponse : null;
  } catch (error) {
    console.error('Check membership error:', error);
    throw error;
  }
}

// List memberships with filtering and pagination
export async function listMemberships(
  filter: Partial<IMembershipResponse> = {}, 
  page = 1, 
  limit = 10
) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [memberships, total] = await Promise.all([
      Membership.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .populate('organizationId', 'name slug'),
      Membership.countDocuments(filter)
    ]);

    return {
      memberships: memberships.map(m => m.toObject()),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('List memberships error:', error);
    throw error;
  }
}

export async function getMembershipByOrgId(orgId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(orgId)) {
      throw new Error('Invalid organization ID');
    }

    const memberships = await Membership.find({ organizationId: orgId });
    const allMemberships  = memberships;
    var members = [] as string[];
    var owners = [] as string[];
    var admins = [] as string[];
    var memberIds = [] as string[];
    var ownerIds = [] as string[];
    var adminIds = [] as string[];
    var allMemberIds = [] as string[];

    allMemberships.forEach((m) => {
      if (m.role === 'member') {
        members.push(m);
        memberIds.push(m.userId.toString());
      } else if (m.role === 'owner') {
        owners.push(m)
        ownerIds.push(m.userId.toString());
      } else {
        admins.push(m);
        adminIds.push(m.userId.toString());
      }
      allMemberIds.push(m.userId.toString());
    });
    return {allMemberships, members, owners, admins, memberIds, ownerIds, adminIds, allMemberIds};
  } catch (error) {
    console.error('Get membership by organization ID error:', error);
    throw error;
  }
}



export async function getMembersOfOrg(orgId: string) {
  try {
    await connectToDatabase();
    const memberships = await Membership.find({ organizationId: orgId });
    const fullMemberships = await Promise.all(
      memberships.map(async (membership) => {
        const user = await User.findOne({_id: membership.userId});
        const userObj = {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        };
        const membershipObj = membership.toObject();
        return {
          ...membershipObj,
          userObj
        };
      })
    );
    return ToClientObj(fullMemberships);
  }catch (error) {
    console.error('Get members of organization error:', error);
    throw error;
  }
}