"use client";

import { ErrorState } from "@novadent/ui";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorState title="Unable to load this page" description="Something went wrong." onRetry={reset} />;
}
