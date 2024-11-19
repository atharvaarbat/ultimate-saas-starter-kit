import { Organization } from '@/server/schema/organization'; // Adjust import path as needed
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb'; // Assume you have a database connection utility

// Type definition for Organization input
interface OrganizationInput {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
}

// Create a new organization
export async function createOrganization(data: OrganizationInput) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Create a new organization
    const newOrganization = new Organization({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      logo: data.logo || '',
      website: data.website || ''
    });

    // Save the organization
    const savedOrganization = await newOrganization.save();
    
    return {
      success: true,
      data: savedOrganization.toObject(),
      error: null
    };
  } catch (error: any) {
    // Handle potential errors (e.g., duplicate slug)
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to create organization'
    };
  }
}

// Get all organizations
export async function getOrganizations() {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Fetch all organizations
    const organizations = await Organization.find().lean();
    
    return {
      success: true,
      data: organizations,
      error: null
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to fetch organizations'
    };
  }
}

// Get a single organization by slug
export async function getOrganizationBySlug(slug: string) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Find organization by slug
    const organization = await Organization.findOne({ slug }).lean();
    
    if (!organization) {
      return {
        success: false,
        data: null,
        error: 'Organization not found'
      };
    }

    return {
      success: true,
      data: organization,
      error: null
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to fetch organization'
    };
  }
}

// Update an organization by slug
export async function updateOrganization(slug: string, data: Partial<OrganizationInput>) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Update the organization
    const updatedOrganization = await Organization.findOneAndUpdate(
      { slug },
      { 
        ...data,
        updatedAt: new Date() 
      },
      { 
        new: true,  // Return the updated document
        runValidators: true // Run model validations on update
      }
    ).lean();

    if (!updatedOrganization) {
      return {
        success: false,
        data: null,
        error: 'Organization not found'
      };
    }

    return {
      success: true,
      data: updatedOrganization,
      error: null
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to update organization'
    };
  }
}

// Delete an organization by slug
export async function deleteOrganization(slug: string) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Delete the organization
    const deletedOrganization = await Organization.findOneAndDelete({ slug }).lean();

    if (!deletedOrganization) {
      return {
        success: false,
        data: null,
        error: 'Organization not found'
      };
    }

    return {
      success: true,
      data: deletedOrganization,
      error: null
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to delete organization'
    };
  }
}