"use client";

import { ErrorState } from "@novadent/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <ErrorState title="Something went wrong" description="Unable to load the dashboard." onRetry={reset} />
    </div>
  );
}
