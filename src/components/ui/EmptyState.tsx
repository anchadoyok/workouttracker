import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <Card className="border border-dashed border-stone-200 bg-stone-50 text-center">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600">{description}</p>
    </div>
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </Card>
);
