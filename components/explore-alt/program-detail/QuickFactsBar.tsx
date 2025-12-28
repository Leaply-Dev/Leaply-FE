"use client";

import { Clock, DollarSign, FileText, GraduationCap } from "lucide-react";
import type { ProgramDetailResponse } from "@/lib/api/types";

interface QuickFactsBarProps {
	program: ProgramDetailResponse;
}

/**
 * Quick Facts Bar - Displays key program metrics
 */
export function QuickFactsBar({ program }: QuickFactsBarProps) {
	const formatCurrency = (amount?: number) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const facts = [
		{
			icon: DollarSign,
			label: "Tuition",
			value: program.tuition?.annualUsd
				? `${formatCurrency(program.tuition.annualUsd)}/yr`
				: formatCurrency(program.tuitionAnnualUsd) + "/yr",
		},
		{
			icon: Clock,
			label: "Duration",
			value: program.durationMonths
				? `${program.durationMonths} months`
				: "N/A",
		},
		{
			icon: GraduationCap,
			label: "IELTS Min",
			value: program.requirements?.ieltsMinimum
				? program.requirements.ieltsMinimum.toString()
				: program.ieltsMinimum?.toString() || "N/A",
		},
		{
			icon: FileText,
			label: "GPA Min",
			value: program.requirements?.gpaMinimum
				? `${program.requirements.gpaMinimum}/${program.requirements.gpaScale || 4.0}`
				: "N/A",
		},
	];

	return (
		<div className="bg-card border border-border rounded-xl p-4 shadow-sm">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{facts.map((fact, i) => {
					const Icon = fact.icon;
					return (
						<div
							key={fact.label}
							className={`flex items-center gap-3 ${
								i < facts.length - 1 ? "md:border-r md:border-border" : ""
							}`}
						>
							<div className="p-2 rounded-lg bg-muted">
								<Icon className="w-5 h-5 text-primary" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wider">
									{fact.label}
								</p>
								<p className="text-lg font-bold text-foreground">
									{fact.value}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
