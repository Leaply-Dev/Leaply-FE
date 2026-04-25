import posthog from "posthog-js";
import type { EventName, EventProps } from "./events";
import { sanitizeProps } from "./sanitize";

function isLoaded(): boolean {
	try {
		return typeof posthog !== "undefined" && posthog.__loaded === true;
	} catch {
		return false;
	}
}

export const analytics = {
	track<E extends EventName>(event: E, props: EventProps<E>): void {
		if (!isLoaded()) return;
		try {
			posthog.capture(event, sanitizeProps(props as Record<string, unknown>));
		} catch {}
	},

	identify(
		userId: string,
		traits: { email?: string; name?: string; last_active_at?: string },
	): void {
		if (!isLoaded()) return;
		try {
			posthog.identify(userId, {
				...(traits.email ? { email: traits.email } : {}),
				...(traits.name ? { name: traits.name } : {}),
				...(traits.last_active_at
					? { last_active_at: traits.last_active_at }
					: {}),
			});
		} catch {}
	},

	reset(): void {
		if (!isLoaded()) return;
		try {
			posthog.reset();
		} catch {}
	},

	captureException(err: unknown): void {
		if (!isLoaded()) return;
		try {
			posthog.captureException(err);
		} catch {}
	},
};
