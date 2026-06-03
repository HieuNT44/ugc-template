import { cn } from "@/lib/utils";

interface AuthFormCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthFormCard({ children, className }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "AuthFormCard border-border bg-card rounded-xl border p-6 shadow-lg sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
