"use client";

import { Button } from "@novadent/ui";

interface DsarDownloadButtonProps {
  filename: string;
  // ponytail: serialized server-side so Dates are ISO strings — no client-side Prisma types needed
  data: string;
}

export function DsarDownloadButton({ filename, data }: DsarDownloadButtonProps) {
  function handleDownload() {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      Download patient data (JSON)
    </Button>
  );
}
