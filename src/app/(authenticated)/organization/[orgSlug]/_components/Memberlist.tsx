import React, { useState, useMemo } from 'react';
import { User, ShieldCheck, Crown, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Member {
    _id: string;
    userObj: {
        name: string;
        email: string;
        avatar?: string;
    };
    role: 'owner' | 'admin' | 'member';
}

interface MembersListProps {
    members: Member[];
    userRole: 'owner' | 'admin' | 'member' | undefined;
    orgId: string;
    onRemoveMember?: (memberId: string) => void;
}

const renderMemberBadge = (memberType: Member['role']) => {
    const badgeMap = {
        'owner': <Crown className="w-4 h-4 text-yellow-500" />,
        'admin': <ShieldCheck className="w-4 h-4 text-blue-500" />,
        'member': <User className="w-4 h-4 text-gray-500" />,
    };
    return badgeMap[memberType] || null;
};

export const MembersList: React.FC<MembersListProps> = ({
    members,
    userRole,
    orgId,
    onRemoveMember
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<Member['role'] | 'all'>('all');

    // Memoized filtering logic
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesSearch =
                member.userObj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.userObj.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRoleFilter =
                roleFilter === 'all' || member.role === roleFilter;

            return matchesSearch && matchesRoleFilter;
        });
    }, [members, searchTerm, roleFilter]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
    };

    // Render methods
    const renderSearchBar = () => (
        <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search members by name or email"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select
                value={roleFilter}
                onValueChange={(value: Member['role'] | 'all') => setRoleFilter(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="owner">Owners</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="member">Members</SelectItem>

                </SelectContent>
            </Select>
            {(searchTerm !== '' || roleFilter !== 'all') && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );

    return (
        <div className="bg-background shadow-sm rounded-lg px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    Members
                    <span className="text-sm text-muted-foreground ml-2 font-normal">
                        ({filteredMembers.length} of {members.length})
                    </span>
                </h2>
            </div>

            {renderSearchBar()}

            <div className="space-y-3">
                {filteredMembers.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                        No members found
                    </div>
                ) : (
                    filteredMembers.map(member => (
                        <div
                            key={member._id}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    {renderMemberBadge(member.role)}
                                </div>
                                <div>
                                    <p className="font-medium">{member.userObj.name}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {member.userObj.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {(userRole === 'owner' || userRole === 'admin') && (
                                    <Button
                                        variant="destructive"
                                        size='sm'
                                        onClick={() => onRemoveMember?.(member._id)}
                                        disabled={member.role === 'owner'}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MembersList;