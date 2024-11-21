import React from 'react';
import { User, ShieldCheck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';


export const MembersList: React.FC<MembersListProps> = ({ members, orgId, userRole }) => {


    return (
        <div className="bg-background shadow-sm rounded-lg px-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <div className="space-y-3">
                {members.map(member => (
                    <div
                        key={member._id}
                        className="flex items-center justify-between p-3 rounded-md"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="font-medium">{member.userObj.name}</p>
                                <p className="text-gray-500 text-sm">{member.userObj.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {renderMemberBadge(member.role)}
                            {(userRole === 'owner' || userRole === 'admin') && (
                                <Button variant="destructive">
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

interface Member {
    _id: string;
    userObj: {
        name: string;
        email: string;
        avatar: string;
    };
    role: string;
}

interface MembersListProps {
    members: Member[];
    userRole: 'owner' | 'admin' | 'member' | 'viewer' | undefined;
    orgId: string
}

const renderMemberBadge = (memberType: string) => {
    if (memberType === 'owner') {
        return <Crown className="w-4 h-4 text-yellow-500" />;
    }
    if (memberType === 'admin') {
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    }
    return null;
};