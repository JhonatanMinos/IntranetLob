import { Skeleton } from '../ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
}
