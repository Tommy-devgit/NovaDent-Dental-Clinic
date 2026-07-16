"use client";

import Link from "next/link";

import { Button, ErrorState } from "@novadent/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">
      <ErrorState
        title="Something went wrong"
        description="We hit a snag loading this page."
        onRetry={reset}
      />
      <div className="mt-4 text-center">
        <Button variant="link" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
