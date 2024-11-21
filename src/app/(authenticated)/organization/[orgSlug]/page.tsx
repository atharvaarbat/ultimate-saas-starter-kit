import { Suspense } from 'react';
import { getOrganizationBySlug } from '@/server/action/organization';
import { getCuurentUser } from '@/server/action/auth';
import { OrganizationDetailsClient } from './_components/OrgDetailsContent';
import OrgDetailsSkeleton from './_components/OrgSkeleton';


function determineUserRole(
    orgDetails: {
        memberIds: string[],
        adminIds: string[],
        ownerIds: string[]
    },
    userId: string
) {
    console.log(orgDetails);
    if (orgDetails.ownerIds.includes(userId)) {
        return 'owner';
    } else if (orgDetails.adminIds.includes(userId)) {
        console.log('found admin');
        return 'admin';
    } else if (orgDetails.memberIds.includes(userId)) {
        return 'member';
    }
    return undefined;
}

export default async function Page({
    params
}: {
    params: Promise<{ orgSlug: string }>
}) {
    const orgSlug = (await params).orgSlug
    const user = await getCuurentUser();
    try {
        const {
            organization,
            memberIds,
            adminIds,
            ownerIds,
            allMemberships
        } = await getOrganizationBySlug(orgSlug);

        const userRole = determineUserRole(
            { memberIds, adminIds, ownerIds },
            user._id
        );
        // console.log(orgSlug);
        return (
            <Suspense fallback={<OrgDetailsSkeleton />} >
                <OrganizationDetailsClient
                    initialOrganization={{
                        ...organization,
                        memberIds,
                        adminIds,
                        ownerIds,
                        allMemberships
                    }}
                    userRole={userRole}
                />
            </Suspense>
        );
    } catch (error) {
        // Handle error (could redirect or show error message)
        return <div>Failed to load organization</div>;
    }
}
