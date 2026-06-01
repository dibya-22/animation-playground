import { cn } from "@/lib/utils";

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

interface BentoCellProps {
    children: React.ReactNode;
    className?: string;
    span?: 1 | 2 | 3 | 4;
    label?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full", className)}>
            {children}
        </div>
    );
}

export function BentoCell({ children, className, span = 1, label }: BentoCellProps) {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground border border-border",
                "rounded-lg p-4 overflow-hidden min-w-0",
                "flex flex-col",
                span === 2 && "sm:col-span-2",
                span === 3 && "sm:col-span-2 lg:col-span-3",
                className
            )}
        >
            {label && (
                <span className="text-xs text-muted-foreground font-medium mb-2 self-start">
                    {label}
                </span>
            )}
            <div className="flex justify-center items-center flex-1">
                {children}
            </div>
        </div>
    );
}

export function BentoGrid4({ children, className }: BentoGridProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full", className)}>
            {children}
        </div>
    );
}

export function BentoCell4({ children, className, span = 1, label }: BentoCellProps) {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground border border-border",
                "rounded-md p-3 overflow-hidden min-w-0",
                "flex flex-col",
                "col-span-2 sm:col-span-1",
                span === 2 && "col-span-2",
                span === 3 && "col-span-2 sm:col-span-3",
                span === 4 && "col-span-2 sm:col-span-2 lg:col-span-4",
                className
            )}
        >
            {label && (
                <span className="text-xs text-muted-foreground font-medium mb-2 self-start">
                    {label}
                </span>
            )}
            <div className="flex justify-center items-center flex-1">
                {children}
            </div>
        </div>
    );
}