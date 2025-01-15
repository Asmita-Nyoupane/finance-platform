import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
    <div className="flex flex-col gap-1">
        <Skeleton className="w-1/3 h-8" /> {/* Account Name */}
        <Skeleton className="w-1/4 h-6" /> {/* Balance */}
        <Skeleton className="w-1/2 h-6" /> {/* Account Type */}
        <Skeleton className="w-1/3 h-6" /> {/* Back Button */}
    </div>
);

export const ChartSkeleton = () => (
    <Skeleton className="w-full h-[300px] rounded-lg" />
);

export const TransactionDetailsSkeleton = () => (
    <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-[60px] rounded-lg" />
        ))}
    </div>
);
