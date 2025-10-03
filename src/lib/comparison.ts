const COMPARISON_KEY = "controller-comparison";
const MAX_COMPARISON = 2;

export interface ComparisonItem {
	company: string;
	controller: string;
}

export function getComparison(): ComparisonItem[] {
	if (typeof window === "undefined") return [];
	const stored = localStorage.getItem(COMPARISON_KEY);
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

export function addToComparison(company: string, controller: string): boolean {
	const comparison = getComparison();

	if (
		comparison.some((c) => c.company === company && c.controller === controller)
	) {
		return false;
	}

	if (comparison.length >= MAX_COMPARISON) {
		return false;
	}

	comparison.push({ company, controller });
	localStorage.setItem(COMPARISON_KEY, JSON.stringify(comparison));
	window.dispatchEvent(new Event("storage"));
	return true;
}

export function removeFromComparison(
	company: string,
	controller: string,
): void {
	const comparison = getComparison();
	const filtered = comparison.filter(
		(c) => !(c.company === company && c.controller === controller),
	);
	localStorage.setItem(COMPARISON_KEY, JSON.stringify(filtered));
	window.dispatchEvent(new Event("storage"));
}

export function isInComparison(company: string, controller: string): boolean {
	const comparison = getComparison();
	return comparison.some(
		(c) => c.company === company && c.controller === controller,
	);
}

export function toggleComparison(company: string, controller: string): boolean {
	if (isInComparison(company, controller)) {
		removeFromComparison(company, controller);
		return false;
	} else {
		return addToComparison(company, controller);
	}
}

export function clearComparison(): void {
	localStorage.setItem(COMPARISON_KEY, JSON.stringify([]));
	window.dispatchEvent(new Event("storage"));
}
