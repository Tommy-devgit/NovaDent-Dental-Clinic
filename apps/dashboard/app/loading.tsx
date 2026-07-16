import { Skeleton } from "@novadent/ui";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Skeleton className="h-10 w-48" />
    </div>
  );
}
