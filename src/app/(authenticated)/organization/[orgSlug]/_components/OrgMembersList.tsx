'use client';

import React from 'react';
import { User, ShieldCheck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface Member {
  id: string;
  name: string;
  email: string;
}

type OrganizationRole = 'owner' | 'admin' | 'member';

interface MembersListProps {
  members: Member[];
  owners: string[];
  admins: string[];
  userRole: OrganizationRole | undefined;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  owners,
  admins,
  userRole
}) => {
  const renderMemberBadge = (memberId: string) => {
    if (owners.includes(memberId)) {
      return <Crown className="w-4 h-4 text-yellow-500" />;
    }
    if (admins.includes(memberId)) {
      return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Members</h2>
      <div className="space-y-3">
        {members.map(member => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-gray-500 text-sm">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {renderMemberBadge(member.id)}
              {(userRole === 'owner' || userRole === 'admin') && (
                <button className="text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {(userRole === 'owner' || userRole === 'admin') && (
        <Button variant="secondary">
            Invite Members
        </Button>
      )}
    </div>
  );
};