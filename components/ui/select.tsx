import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest/40 focus:ring-2 focus:ring-gold/40",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";

