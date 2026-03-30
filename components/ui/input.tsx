import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-forest/40 focus:ring-2 focus:ring-gold/40",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";

