import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-3.5 sm:p-4 text-sm flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-900 border-slate-200/80 shadow-soft-xs [&>svg]:text-slate-600",
        destructive:
          "border-rose-200 bg-rose-50/90 text-rose-800 [&>svg]:text-rose-600",
        warning:
          "border-amber-200 bg-amber-50/90 text-amber-900 [&>svg]:text-amber-600",
        success:
          "border-emerald-200 bg-emerald-50/90 text-emerald-900 [&>svg]:text-emerald-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), "[&>svg]:shrink-0 [&>svg]:mt-0.5", className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-bold leading-snug tracking-tight text-xs sm:text-sm mb-1", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed text-slate-600 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
