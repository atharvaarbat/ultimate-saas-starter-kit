"use server";

import { Organization } from "@/server/schema/organization";
import { connectToDatabase } from "@/lib/mongodb";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { Membership } from "../schema/memberships";
import { createMembership, getMembershipByOrgId } from "./memberships";
import { verifySession } from "@/lib/statelessSession";
import { User } from "../schema/user";
import { createInviteNotification } from "./notification";

// Create a new organization
export async function createOrganization(
  orgData: ICreateOrganization
): Promise<IOrganizationResponse> {
  try {
    await connectToDatabase();
    const userId = (await verifySession()).userId;
    if(!userId){
      throw new Error("User not found");
    }
    // Check if organization with same name already exists
    const existingOrg = await Organization.findOne({
      name: { $regex: new RegExp(`^${orgData.name}$`, "i") },
    });

    if (existingOrg) {
      throw new Error("Organization with this name already exists");
    }

    // Create organization
    const organization = await Organization.create({
      ...orgData,
      logo: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
        orgData.name
      )}`,
    });
    const membership = await createMembership({
      organizationId: organization._id,
      userId: userId,
      role: "owner",
      status: "active",
    });
    revalidatePath("/organizations"); // Revalidate organizations list page
    return JSON.parse(JSON.stringify(organization)) as IOrganizationResponse;
  } catch (error) {
    console.error("Create organization error:", error);
    throw error;
  }
}

// Get organization by ID
export async function getOrganizationById(
  orgId: string
): Promise<IOrganizationResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(orgId)) {
      throw new Error("Invalid organization ID");
    }

    const organization = await Organization.findById(orgId);
    return organization
      ? (organization.toObject() as IOrganizationResponse)
      : null;
  } catch (error) {
    console.error("Get organization error:", error);
    throw error;
  }
}

// Get organization by slug
export async function getOrganizationBySlug(slug: string) {
  try {
    await connectToDatabase();

    var organization = await Organization.findOne({ slug });
    var { memberIds, adminIds, ownerIds, allMemberships } =
      await getMembershipByOrgId(organization._id);

    return JSON.parse(
      JSON.stringify({
        organization,
        memberIds,
        adminIds,
        ownerIds,
        allMemberships,
      })
    );
  } catch (error) {
    console.error("Get organization by slug error:", error);
    throw error;
  }
}

// Update organization
export async function updateOrganization(
  orgId: string,
  updateData: IUpdateOrganization
): Promise<IOrganizationResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(orgId)) {
      throw new Error("Invalid organization ID");
    }

    const organization = await Organization.findByIdAndUpdate(
      orgId,
      {
        ...updateData,

        updatedAt: new Date(),
      },
      { new: true }
    );

    revalidatePath(`/organizations/${organization?.slug}`); // Revalidate organization detail page
    revalidatePath("/organizations"); // Revalidate organizations list page
    return organization
      ? (organization.toObject() as IOrganizationResponse)
      : null;
  } catch (error) {
    console.error("Update organization error:", error);
    throw error;
  }
}

// Delete organization
export async function deleteOrganization(orgId: string): Promise<boolean> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(orgId)) {
      throw new Error("Invalid organization ID");
    }

    const result = await Organization.findByIdAndDelete(orgId);
    revalidatePath("/organizations"); // Revalidate organizations list page
    return !!result;
  } catch (error) {
    console.error("Delete organization error:", error);
    throw error;
  }
}

// List organizations with pagination and search
export async function listOrganizations(page = 1, limit = 10, search?: string) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [organizations, total] = await Promise.all([
      Organization.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Organization.countDocuments(query),
    ]);

    return {
      organizations: organizations.map((org) =>
        org.toObject()
      ) as IOrganizationResponse[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("List organizations error:", error);
    throw error;
  }
}

export async function sendEmailInvitationforOrg(
  orgId: string,
  emails: string[]
) {
  try {
    await connectToDatabase();
    
    const fromUserId = (await verifySession()).userId;
    const fromUser = await User.findById(fromUserId);
    emails.forEach(async (email) => {
      const notification = await createInviteNotification(
        fromUser.email,
        email,
        orgId
      );
    });
  } catch (error) {
    console.error("Send email invitation error:", error);
    throw error;
  }
}

// Types
export interface ICreateOrganization {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}
export interface IOrganization {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  slug?: string;
}
export interface IUpdateOrganization {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
}

export interface IOrganizationResponse {
  _id: Object;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}
