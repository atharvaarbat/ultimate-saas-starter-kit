'use client';

import React, { useEffect, useState } from 'react';
import { OrganizationHeader } from './OrgHeader';
import { MembersList } from './Memberlist';
import { format } from 'date-fns';
import { getMembersOfOrg } from '@/server/action/memberships';

export function OrganizationDetailsClient({ initialOrganization, userRole }: OrganizationDetailsClientProps) {
  

  const [organization, setOrganization] = useState(initialOrganization);
  const [members, setMembers] = useState([]);
  useEffect(() => {
      const fetchMembers = async () => {
          const allMembers = await getMembersOfOrg(organization._id);
          console.log(allMembers);
          setMembers(allMembers);
      }
      fetchMembers();
  }, [])

  const handleEditOrganization = () => {};

  const handleDeleteOrganization = () => {};

  return (
    <div className="container space-y-4 mx-auto">
      <OrganizationHeader
        organization={organization}
        userRole={userRole}
        onEdit={handleEditOrganization}
        onDelete={handleDeleteOrganization}
      />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background shadow-sm rounded-lg p-6">
            <h2 className="text-muted-foreground text-sm">Description</h2>
            <p>{organization.description || 'No description available'}</p>
          </div>
          <div className="bg-background shadow-sm rounded-lg p-6">
            <h2 className="text-muted-foreground text-sm">Created by</h2>
            <p>{organization.description || 'No description available'}</p>
          </div>
          <div className="bg-background shadow-sm rounded-lg p-6">
            <h2 className="text-muted-foreground text-sm">Created on</h2>
            <p>{format(organization.createdAt, 'MMM dd, yyyy') || 'No description available'}</p>
          </div>
          <div className="bg-background shadow-sm rounded-lg p-6">
            <h2 className="text-muted-foreground text-sm">Updated on</h2>
            <p>{format(organization.updatedAt, 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <MembersList 
          members={members} // You'll need to fetch and pass actual member details 
          orgId={organization._id}
          userRole={userRole}
        />
      </div>
    </div>
  );
}




type OrganizationRole = 'owner' | 'admin' | 'member';

interface OrganizationDetailsClientProps {
  initialOrganization: {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    memberIds: string[];
    adminIds: string[];
    ownerIds: string[];
    allMemberships: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  userRole: OrganizationRole | undefined;
}