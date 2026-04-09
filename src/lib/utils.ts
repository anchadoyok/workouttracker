import { clsx } from "clsx";

export const cn = (...inputs: Array<string | false | null | undefined>) => clsx(inputs);

export const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `id-${Math.random().toString(36).slice(2, 11)}`;
};
