import { Skeleton } from "@novadent/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-20 lg:px-8">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  );
}
