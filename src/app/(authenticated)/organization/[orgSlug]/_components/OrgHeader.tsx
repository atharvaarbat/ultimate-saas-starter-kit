'use client';

import React from 'react';
import Image from 'next/image';
import { Edit, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InviteMemberModal } from './InviteModal';

type OrganizationRole = 'owner' | 'admin' | 'member';

interface OrganizationHeaderProps {
    organization: {
        _id: string;
        name: string;
        logo?: string;
        website?: string;
        description?: string;
    };
    userRole: OrganizationRole | undefined;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
    organization,
    userRole,
    onEdit,
    onDelete
}) => {
    return (
        <div className="flex  justify-between px-6 pt-4 shadow-sm">
            <div className="flex items-center space-x-4">
                {organization.logo ? (
                    <img
                        src={organization.logo}
                        alt={`${organization.name} logo`}
                        width={80}
                        height={80}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {organization.name.charAt(0)}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold">{organization.name}</h1>
                    {organization.website && (
                        <Link
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                        >
                            <Globe className="mr-2 w-4 h-4" />
                            {organization.website}
                        </Link>
                    )}
                    <p className="text-muted-foreground mt-2">{organization.description}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                {(userRole === 'owner' || userRole === 'admin') && (
                    <div>
                        <Button
                            variant="outline"

                            onClick={onEdit}
                        >
                            Edit
                        </Button>
                        <InviteMemberModal orgId={organization._id} />
                    </div>

                )}
                {userRole === 'owner' && (
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={onDelete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
    );
};