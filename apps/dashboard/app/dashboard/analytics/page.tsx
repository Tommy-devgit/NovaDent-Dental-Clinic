import { PageHeader } from "@novadent/ui";

import { AnalyticsView } from "@/components/dashboard/analytics-view";

export default function AnalyticsPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Trends and breakdowns across leads, calls, and appointments."
      />
      <AnalyticsView />
    </div>
  );
}
