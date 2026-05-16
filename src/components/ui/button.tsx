import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "emerald" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variant === "default" && "bg-slate-950 text-white hover:bg-slate-800 active:scale-95",
          variant === "outline" && "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 active:scale-95",
          variant === "ghost"   && "bg-transparent text-slate-600 hover:bg-slate-100",
          variant === "emerald" && "bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-95 font-bold",
          variant === "danger"  && "bg-red-600 text-white hover:bg-red-500 active:scale-95",
          size === "sm" && "h-9 px-4 rounded-xl text-sm",
          size === "md" && "h-12 px-6 rounded-2xl text-base",
          size === "lg" && "h-14 px-8 rounded-2xl text-base",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
