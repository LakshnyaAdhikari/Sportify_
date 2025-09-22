import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-[var(--transition-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-saffron)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[var(--shadow-green)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        /* Sportify Athletic Variants */
        hero: "bg-gradient-to-r from-saffron to-saffron-light text-white hover:from-saffron-dark hover:to-saffron shadow-[var(--shadow-athletic)] hover:shadow-[var(--shadow-glow)] hover:scale-105 font-semibold",
        athletic: "bg-gradient-to-r from-india-green to-india-green-light text-white hover:from-india-green-dark hover:to-india-green shadow-[var(--shadow-green)] hover:scale-105",
        champion: "bg-gradient-to-r from-india-blue to-india-blue-light text-white hover:shadow-[var(--shadow-athletic)] hover:scale-105 font-bold",
        record: "bg-gradient-to-r from-saffron via-white to-india-green text-neutral-dark hover:scale-105 shadow-lg border border-saffron/20",
        "outline-athletic": "border-2 border-saffron text-saffron hover:bg-saffron hover:text-white hover:shadow-[var(--shadow-saffron)]",
        floating: "bg-white/95 backdrop-blur-sm text-neutral-dark hover:bg-white shadow-[var(--shadow-glow)] border border-saffron/20 hover:border-saffron/40",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base font-semibold",
        xl: "h-16 rounded-xl px-12 text-lg font-bold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
