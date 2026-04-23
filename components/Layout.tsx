import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children: ReactNode;
	className?: string;
}

export function PageContainer({ children, className }: LayoutProps) {
	return <div className={cn("page-container", className)}>{children}</div>;
}
