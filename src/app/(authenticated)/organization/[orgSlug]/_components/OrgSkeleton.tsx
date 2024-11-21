import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const OrgDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((item) => (
          <Skeleton key={item} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
};

export default OrgDetailsSkeleton;