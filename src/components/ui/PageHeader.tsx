import type { ReactNode } from "react";

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-stone-950">{title}</h1>
      <p className="text-sm text-stone-600">{description}</p>
    </div>
    {action ? <div className="flex-shrink-0">{action}</div> : null}
  </div>
);
