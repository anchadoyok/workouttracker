import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Surface = ({ className, children, ...props }: HTMLAttributes<HTMLElement>) => (
  <section
    className={cn(
      "glass-surface rounded-[28px] p-5 shadow-panel transition-transform duration-300 sm:p-6",
      className,
    )}
    {...props}
  >
    {children}
  </section>
);
