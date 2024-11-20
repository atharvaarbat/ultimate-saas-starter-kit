// app/actions/users.ts
'use server'

import { User } from '@/server/schema/user';
import { connectToDatabase } from '@/lib/mongodb';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';

// Types
export interface ICreateUser {
  email: string;
  name: string;
  password: string;
  avatar?: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  isEmailVerified?: boolean;
}

export interface IUserResponse {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new user
export async function createUser(userData: ICreateUser): Promise<IUserResponse> {
  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user.toObject();
    revalidatePath('/users'); // Revalidate users list page
    return userWithoutPassword as IUserResponse;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<IUserResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findById(userId).select('-password');
    return user ? (user.toObject() as IUserResponse) : null;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<IUserResponse | null> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email }).select('-password');
    return user ? (user.toObject() as IUserResponse) : null;
  } catch (error) {
    console.error('Get user by email error:', error);
    throw error;
  }
}

// Update user
export async function updateUser(
  userId: string,
  updateData: IUpdateUser
): Promise<IUserResponse | null> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // If email is being updated, check if it's already in use
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    revalidatePath(`/users/${userId}`); // Revalidate user detail page
    revalidatePath('/users'); // Revalidate users list page
    return user ? (user.toObject() as IUserResponse) : null;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const result = await User.findByIdAndDelete(userId);
    revalidatePath('/users'); // Revalidate users list page
    return !!result;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

// List users with pagination and search
export async function listUsers(page = 1, limit = 10, search?: string) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users: users.map(user => user.toObject()) as IUserResponse[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('List users error:', error);
    throw error;
  }
}

// Verify password (for login)
export async function verifyPassword(
  email: string,
  password: string
): Promise<IUserResponse | null> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword as IUserResponse;
  } catch (error) {
    console.error('Verify password error:', error);
    throw error;
  }
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
      updatedAt: new Date(),
    });
    
    revalidatePath(`/users/${userId}`);
  } catch (error) {
    console.error('Update last login error:', error);
    throw error;
  }
}