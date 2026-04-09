import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const Card = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <section className={cn("rounded-3xl bg-white p-5 shadow-card ring-1 ring-stone-100", className)}>
    {children}
  </section>
);
