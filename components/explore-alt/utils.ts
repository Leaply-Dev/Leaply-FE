export function getDaysUntilDeadline(deadline?: string): number | null {
	if (!deadline) return null;
	const now = new Date();
	const deadlineDate = new Date(deadline);
	const diffTime = deadlineDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function formatCurrency(amount?: number): string {
	if (!amount) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}
