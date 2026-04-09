import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary: "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50",
  ghost: "text-stone-600 hover:bg-stone-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
      variants[variant],
      fullWidth && "w-full",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
