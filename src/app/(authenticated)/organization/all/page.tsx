import React from 'react';
import { Building2, Globe, Users, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getOrganizationsCurrUser } from '@/server/action/memberships'; // Assuming this is your server action
import { IOrganization } from '@/server/action/organization';
import Link from 'next/link';

const OrganizationsPage = async () => {
    let organizations: IOrganization[] = [];
    try {
        organizations = await getOrganizationsCurrUser();
    } catch (error) {
        console.error('Failed to fetch organizations:', error);
        organizations = [];
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">My Organizations</h1>
                <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Create Organization
                </Button>
            </div>

            {organizations.length === 0 ? (
                <div className="text-center py-16">
                    <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Organizations Yet</h2>
                    <p className="text-gray-600">
                        You haven't joined or created any organizations.
                        Start by creating your first organization!
                    </p>
                    <Button className="mt-4">Create First Organization</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <Card key={org._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">{org.name}</h2>
                                    {org.logo ? (
                                        <img
                                            src={org.logo}
                                            alt={`${org.name} logo`}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Building2 className="h-6 w-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {org.description && (
                                        <p className="text-gray-600 line-clamp-3">
                                            {org.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        {org.website && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Globe className="h-4 w-4 text-gray-500" />
                                                <a
                                                    href={org.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline truncate"
                                                >
                                                    {org.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span>Team Overview</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                        <Link href={`/organization/${org.slug}`}>
                                            <Button size="sm">
                                                Manage
                                            </Button>
                                        </Link>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganizationsPage;