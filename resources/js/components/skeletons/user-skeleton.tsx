import { Skeleton } from '../ui/skeleton';

export function UserSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 p-5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="mb-4 gap-6" />
            ))}
        </div>
    );
}
