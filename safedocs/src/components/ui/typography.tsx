import { cn } from "@/lib/utils";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-sm tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyH4Muted({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-sm text-muted-foreground tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
}


export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p className={cn("leading-7 text-xs    [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}

export function TypographyPMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn("leading-7 text-xs text-muted-foreground [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}