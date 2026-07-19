import { Button } from "@novadent/ui";

interface ExportCsvButtonProps {
  href: string;
}

export function ExportCsvButton({ href }: ExportCsvButtonProps) {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} download>
        Export CSV
      </a>
    </Button>
  );
}
