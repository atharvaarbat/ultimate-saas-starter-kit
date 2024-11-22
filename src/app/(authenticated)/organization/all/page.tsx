'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { 
    Building2, 
    Globe, 
    Users, 
    PlusCircle, 
    Search, 
    MoreHorizontal 
} from 'lucide-react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { IOrganization } from '@/server/action/organization';
import { getOrganizationsCurrUser } from '@/server/action/memberships';



const OrganizationsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [organizations, setOrganizations] = useState<IOrganization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const allOrganizations = await getOrganizationsCurrUser();
                setOrganizations(allOrganizations);
            } catch (error) {
                console.error('Failed to fetch organizations:', error);
                setOrganizations([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrganizations();
    }, [])
    // Memoized filtering of organizations
    const filteredOrganizations = useMemo(() => {
        return organizations.filter(org => 
            org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [organizations, searchTerm]);

    // Skeleton loading rows
    const renderSkeletonRows = () => (
        Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
                <TableCell>
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
        ))
    );

    // Render organization rows
    const renderOrganizationRows = () => (
        filteredOrganizations.map((org) => (
            <TableRow key={org._id}>
                <TableCell>
                    <div className="flex items-center space-x-3">
                        {org.logo ? (
                            <img
                                src={org.logo}
                                alt={`${org.name} logo`}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-gray-500" />
                            </div>
                        )}
                        <span className="font-medium">{org.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {org.description ? (
                        <span className="line-clamp-1">{org.description}</span>
                    ) : (
                        <span className="text-gray-400">No description</span>
                    )}
                </TableCell>
                <TableCell>
                    {org.website ? (
                        <a 
                            href={org.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {org.website.replace(/^https?:\/\//, '')}
                        </a>
                    ) : (
                        <span className="text-gray-400">No website</span>
                    )}
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Link href={`/organization/${org.slug}`}>
                            <Button variant="outline" size="sm">
                                Manage
                            </Button>
                        </Link>
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </div>
                </TableCell>
            </TableRow>
        ))
    );

    // Empty state component
    const EmptyState = () => (
        <div className="text-center py-16">
            <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Organizations Yet</h2>
            <p className="text-gray-600 mb-4">
                You haven't joined or created any organizations.
                Start by creating your first organization!
            </p>
            <Button>
                Create First Organization
            </Button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">My Organizations</h1>
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    
                >
                    <PlusCircle className="h-5 w-5" />
                    Create Organization
                </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex items-center space-x-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                        placeholder="Search organizations by name or description" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Organizations Table */}
            {isLoading ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderSkeletonRows()}
                    </TableBody>
                </Table>
            ) : filteredOrganizations.length === 0 ? (
                <EmptyState />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderOrganizationRows()}
                    </TableBody>
                </Table>
            )}

            {/* Pagination could be added here in future */}
        </div>
    );
};

export default OrganizationsPage;